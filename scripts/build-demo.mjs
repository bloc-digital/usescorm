import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { strToU8, zipSync } from 'fflate';
import { build } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'demo-dist');
const app = join(output, 'app');
const remoteCourse = join(output, 'remote-course');
const remoteWrapper = join(output, 'remote-wrapper');
const viteConfig = join(root, 'vite.config.ts');

const courseUrlArg = process.argv.find((arg) => arg.startsWith('--course-url='))?.slice('--course-url='.length);
// PowerShell's npm shim drops "--", so npm consumes the flag and exposes it as npm_config_course_url.
const courseUrl = courseUrlArg ?? process.env.npm_config_course_url ?? process.env.COURSE_URL;

if (courseUrl) {
  const { protocol } = new URL(courseUrl);
  if (protocol !== 'https:' && protocol !== 'http:') throw new Error(`--course-url must be http(s): ${courseUrl}`);
}

const readFiles = async (directory) => {
  const files = {};

  for (const name of (await readdir(directory, { recursive: true })).sort()) {
    const path = join(directory, name);
    if ((await stat(path)).isFile()) files[name.split(sep).join('/')] = new Uint8Array(await readFile(path));
  }

  return files;
};

const escapeXml = (value) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;',
      })[character],
  );

const writeScormZips = async (files, prefix, title) => {
  for (const version of ['1.2', '2004']) {
    const is12 = version === '1.2';
    const namespace = is12 ? 'http://www.imsproject.org/xsd/imscp_rootv1p1p2' : 'http://www.imsglobal.org/xsd/imscp_v1p1';
    const adlNamespace = is12 ? 'http://www.adlnet.org/xsd/adlcp_rootv1p2' : 'http://www.adlnet.org/xsd/adlcp_v1p3';
    const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="usescorm-${prefix}-${version.replace('.', '-')}" version="1.0"
  xmlns="${namespace}" xmlns:adlcp="${adlNamespace}"
  ${is12 ? '' : 'xmlns:imsss="http://www.imsglobal.org/xsd/imsss"'}>
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>${is12 ? '1.2' : '2004 4th Edition'}</schemaversion>
  </metadata>
  <organizations default="test-organization">
    <organization identifier="test-organization">
      <title>${escapeXml(title)}</title>
      <item identifier="test-activity" identifierref="test-resource">
        <title>SCORM ${version} runtime test</title>${
          is12
            ? ''
            : `
        <imsss:sequencing>
          <imsss:deliveryControls completionSetByContent="true" objectiveSetByContent="true"/>
        </imsss:sequencing>`
        }
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="test-resource" type="webcontent" adlcp:${is12 ? 'scormtype' : 'scormType'}="sco" href="index.html">
${Object.keys(files)
  .map((name) => `      <file href="${escapeXml(name)}"/>`)
  .join('\n')}
    </resource>
  </resources>
</manifest>
`;
    const archive = zipSync({ ...files, 'imsmanifest.xml': strToU8(manifest) }, { level: 6 });
    const destination = join(output, `${prefix}-${version}.zip`);
    await writeFile(destination, archive);
    console.log(`Created ${destination}`);
  }
};

// Self-contained test bench, uploaded straight to the LMS.
await build({ configFile: viteConfig });
await writeScormZips(await readFiles(app), 'scorm', 'useScorm test bench');

// Remote test bench: a static site to host anywhere, reached through the bridge.
await build({
  configFile: viteConfig,
  root: join(root, 'demo', 'remote'),
  build: { outDir: remoteCourse, emptyOutDir: true },
});
console.log(`Created ${remoteCourse} (host this folder over HTTPS)`);

// Thin SCORM wrapper that frames the remote course and runs the bridge host.
await rm(remoteWrapper, { recursive: true, force: true });
await mkdir(remoteWrapper, { recursive: true });
await build({
  configFile: join(root, 'vite.host.config.ts'),
  build: { outDir: remoteWrapper, emptyOutDir: false },
});

const template = await readFile(join(root, 'demo', 'remote-wrapper', 'index.html'), 'utf8');
// JSON keeps the URL a safe JS string; escaping "<" stops it closing the script tag.
const wrapperHtml = courseUrl
  ? template.replace("'__COURSE_URL__'", JSON.stringify(courseUrl).replace(/</g, '\\u003c'))
  : template;
await writeFile(join(remoteWrapper, 'index.html'), wrapperHtml);
console.log(`Created ${remoteWrapper}`);

if (courseUrl) {
  await writeScormZips(await readFiles(remoteWrapper), 'remote-scorm', 'useScorm remote test bench');
} else {
  console.log(
    'Skipped remote-scorm ZIPs: no course URL. Re-run with `npm run build:demo -- --course-url=https://...` ' +
      'or set the COURSE_URL environment variable.',
  );
}
