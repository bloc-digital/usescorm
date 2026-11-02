import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { strToU8, zipSync } from 'fflate';
import { build } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'demo-dist');
const app = join(output, 'app');

await build({ configFile: join(root, 'vite.config.ts') });

const files = {};
for (const name of (await readdir(app, { recursive: true })).sort()) {
  const path = join(app, name);
  if ((await stat(path)).isFile()) files[name.split(sep).join('/')] = new Uint8Array(await readFile(path));
}

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

for (const version of ['1.2', '2004']) {
  const is12 = version === '1.2';
  const namespace = is12 ? 'http://www.imsproject.org/xsd/imscp_rootv1p1p2' : 'http://www.imsglobal.org/xsd/imscp_v1p1';
  const adlNamespace = is12 ? 'http://www.adlnet.org/xsd/adlcp_rootv1p2' : 'http://www.adlnet.org/xsd/adlcp_v1p3';
  const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="usescorm-test-${version.replace('.', '-')}" version="1.0"
  xmlns="${namespace}" xmlns:adlcp="${adlNamespace}"
  ${is12 ? '' : 'xmlns:imsss="http://www.imsglobal.org/xsd/imsss"'}>
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>${is12 ? '1.2' : '2004 4th Edition'}</schemaversion>
  </metadata>
  <organizations default="test-organization">
    <organization identifier="test-organization">
      <title>useScorm test bench</title>
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
  const destination = join(output, `scorm-${version}.zip`);
  await writeFile(destination, archive);
  console.log(`Created ${destination}`);
}
