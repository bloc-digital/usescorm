export const BRIDGE_NAMESPACE = 'usescorm-bridge';

export type BridgeScormVersion = '1.2' | '2004';
export type BridgeRequestType = 'get' | 'set' | 'commit' | 'terminate';

export interface BridgeResult {
  ok: boolean;
  errorCode: string;
  errorString: string;
  diagnostic: string;
}

export type ClientMessage =
  | { ns: typeof BRIDGE_NAMESPACE; id: number; type: 'connect'; preload?: string[] }
  | { ns: typeof BRIDGE_NAMESPACE; id: number; type: 'get'; element: string }
  | { ns: typeof BRIDGE_NAMESPACE; id: number; type: 'set'; element: string; value: string }
  | { ns: typeof BRIDGE_NAMESPACE; id: number; type: 'commit' | 'terminate' };

export type HostMessage =
  | ({
      ns: typeof BRIDGE_NAMESPACE;
      id: number;
      type: 'ready';
      version: BridgeScormVersion | null;
      snapshot: Record<string, string>;
    } & BridgeResult)
  | ({ ns: typeof BRIDGE_NAMESPACE; id: number; type: 'result'; value?: string } & BridgeResult);

/** Values read from the LMS on connect so the client can answer `GetValue` synchronously. */
export const SNAPSHOT_ELEMENTS: Record<BridgeScormVersion, string[]> = {
  '1.2': [
    'cmi.core._children',
    'cmi.core.student_id',
    'cmi.core.student_name',
    'cmi.core.lesson_location',
    'cmi.core.credit',
    'cmi.core.lesson_status',
    'cmi.core.entry',
    'cmi.core.score._children',
    'cmi.core.score.raw',
    'cmi.core.score.max',
    'cmi.core.score.min',
    'cmi.core.total_time',
    'cmi.core.lesson_mode',
    'cmi.suspend_data',
    'cmi.launch_data',
    'cmi.comments',
    'cmi.comments_from_lms',
    'cmi.objectives._children',
    'cmi.objectives._count',
    'cmi.student_data._children',
    'cmi.student_data.mastery_score',
    'cmi.student_data.max_time_allowed',
    'cmi.student_data.time_limit_action',
    'cmi.student_preference._children',
    'cmi.student_preference.audio',
    'cmi.student_preference.language',
    'cmi.student_preference.speed',
    'cmi.student_preference.text',
    'cmi.interactions._children',
    'cmi.interactions._count',
  ],
  '2004': [
    'cmi._version',
    'cmi.comments_from_learner._children',
    'cmi.comments_from_learner._count',
    'cmi.comments_from_lms._children',
    'cmi.comments_from_lms._count',
    'cmi.completion_status',
    'cmi.completion_threshold',
    'cmi.credit',
    'cmi.entry',
    'cmi.interactions._children',
    'cmi.interactions._count',
    'cmi.launch_data',
    'cmi.learner_id',
    'cmi.learner_name',
    'cmi.learner_preference._children',
    'cmi.learner_preference.audio_level',
    'cmi.learner_preference.language',
    'cmi.learner_preference.delivery_speed',
    'cmi.learner_preference.audio_captioning',
    'cmi.location',
    'cmi.max_time_allowed',
    'cmi.mode',
    'cmi.objectives._children',
    'cmi.objectives._count',
    'cmi.progress_measure',
    'cmi.scaled_passing_score',
    'cmi.score._children',
    'cmi.score.scaled',
    'cmi.score.raw',
    'cmi.score.min',
    'cmi.score.max',
    'cmi.success_status',
    'cmi.suspend_data',
    'cmi.time_limit_action',
    'cmi.total_time',
    'adl.data._count',
  ],
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

/** Only data-model elements may cross the bridge, so a frame cannot reach other API methods. */
export const isDataModelElement = (value: unknown): value is string =>
  typeof value === 'string' && value.length <= 1000 && /^(cmi|adl)\./.test(value);

export function isClientMessage(data: unknown): data is ClientMessage {
  if (!isRecord(data) || data.ns !== BRIDGE_NAMESPACE || typeof data.id !== 'number') return false;

  switch (data.type) {
    case 'connect':
      return data.preload === undefined || (Array.isArray(data.preload) && data.preload.every(isDataModelElement));
    case 'get':
      return isDataModelElement(data.element);
    case 'set':
      return isDataModelElement(data.element) && typeof data.value === 'string';
    case 'commit':
    case 'terminate':
      return true;
    default:
      return false;
  }
}

export function isHostMessage(data: unknown): data is HostMessage {
  if (
    !isRecord(data) ||
    data.ns !== BRIDGE_NAMESPACE ||
    typeof data.id !== 'number' ||
    typeof data.ok !== 'boolean' ||
    typeof data.errorCode !== 'string' ||
    typeof data.errorString !== 'string' ||
    typeof data.diagnostic !== 'string'
  )
    return false;

  switch (data.type) {
    case 'ready':
      return (
        (data.version === '1.2' || data.version === '2004' || data.version === null) &&
        isRecord(data.snapshot) &&
        Object.values(data.snapshot).every((value) => typeof value === 'string')
      );
    case 'result':
      return data.value === undefined || typeof data.value === 'string';
    default:
      return false;
  }
}
