import { TypedEventTarget } from './TypedEventTarget.js';

export type availableVersions = '1.2' | '2004' | 'auto';
export type Scorm12LessonStatus = 'passed' | 'completed' | 'failed' | 'incomplete' | 'browsed' | 'not attempted';
export type Scorm2004CompletionStatus = 'completed' | 'incomplete' | 'not attempted' | 'unknown';
export type Scorm2004SuccessStatus = 'passed' | 'failed' | 'unknown';
export type lesson_status = Scorm12LessonStatus | Scorm2004CompletionStatus | Scorm2004SuccessStatus;

export type CMIElement1_2 =
  | 'cmi.core._children'
  | 'cmi.core.student_id'
  | 'cmi.core.student_name'
  | 'cmi.core.lesson_location'
  | 'cmi.core.credit'
  | 'cmi.core.lesson_status'
  | 'cmi.core.entry'
  | 'cmi.core.score._children'
  | 'cmi.core.score.raw'
  | 'cmi.core.score.max'
  | 'cmi.core.score.min'
  | 'cmi.core.total_time'
  | 'cmi.core.lesson_mode'
  | 'cmi.core.exit'
  | 'cmi.core.session_time'
  | 'cmi.suspend_data'
  | 'cmi.launch_data'
  | 'cmi.comments'
  | 'cmi.comments_from_lms'
  | 'cmi.objectives._children'
  | 'cmi.objectives._count'
  | 'cmi.objectives.n.id'
  | `cmi.objectives.${number}.id`
  | 'cmi.objectives.n.score._children'
  | `cmi.objectives.${number}.score._children`
  | 'cmi.objectives.n.score.raw'
  | `cmi.objectives.${number}.score.raw`
  | 'cmi.objectives.n.score.max'
  | `cmi.objectives.${number}.score.max`
  | 'cmi.objectives.n.score.min'
  | `cmi.objectives.${number}.score.min`
  | 'cmi.objectives.n.status'
  | `cmi.objectives.${number}.status`
  | 'cmi.student_data._children'
  | 'cmi.student_data.mastery_score'
  | 'cmi.student_data.max_time_allowed'
  | 'cmi.student_data.time_limit_action'
  | 'cmi.student_preference._children'
  | 'cmi.student_preference.audio'
  | 'cmi.student_preference.language'
  | 'cmi.student_preference.speed'
  | 'cmi.student_preference.text'
  | 'cmi.interactions._children'
  | 'cmi.interactions._count'
  | 'cmi.interactions.n.id'
  | `cmi.interactions.${number}.id`
  | 'cmi.interactions.n.objectives._count'
  | `cmi.interactions.${number}.objectives._count`
  | 'cmi.interactions.n.objectives.n.id'
  | `cmi.interactions.${number}.objectives.${number}.id`
  | 'cmi.interactions.n.time'
  | `cmi.interactions.${number}.time`
  | 'cmi.interactions.n.type'
  | `cmi.interactions.${number}.type`
  | 'cmi.interactions.n.correct_responses._count'
  | `cmi.interactions.${number}.correct_responses._count`
  | 'cmi.interactions.n.correct_responses.n.pattern'
  | `cmi.interactions.${number}.correct_responses.${number}.pattern`
  | 'cmi.interactions.n.weighting'
  | `cmi.interactions.${number}.weighting`
  | 'cmi.interactions.n.student_response'
  | `cmi.interactions.${number}.student_response`
  | 'cmi.interactions.n.result'
  | `cmi.interactions.${number}.result`
  | 'cmi.interactions.n.latency'
  | `cmi.interactions.${number}.latency`;

export type CMIElement2004 =
  | 'cmi._version'
  | 'cmi.comments_from_learner._children'
  | 'cmi.comments_from_learner._count'
  | 'cmi.comments_from_learner.n.comment'
  | `cmi.comments_from_learner.${number}.comment`
  | 'cmi.comments_from_learner.n.location'
  | `cmi.comments_from_learner.${number}.location`
  | 'cmi.comments_from_learner.n.timestamp'
  | `cmi.comments_from_learner.${number}.timestamp`
  | 'cmi.comments_from_lms._children'
  | 'cmi.comments_from_lms._count'
  | 'cmi.comments_from_lms.n.comment'
  | `cmi.comments_from_lms.${number}.comment`
  | 'cmi.comments_from_lms.n.location'
  | `cmi.comments_from_lms.${number}.location`
  | 'cmi.comments_from_lms.n.timestamp'
  | `cmi.comments_from_lms.${number}.timestamp`
  | 'cmi.completion_status'
  | 'cmi.completion_threshold'
  | 'cmi.credit'
  | 'cmi.entry'
  | 'cmi.exit'
  | 'cmi.interactions._children'
  | 'cmi.interactions._count'
  | 'cmi.interactions.n.id'
  | `cmi.interactions.${number}.id`
  | 'cmi.interactions.n.type'
  | `cmi.interactions.${number}.type`
  | 'cmi.interactions.n.objectives._count'
  | `cmi.interactions.${number}.objectives._count`
  | 'cmi.interactions.n.objectives.n.id'
  | `cmi.interactions.${number}.objectives.${number}.id`
  | 'cmi.interactions.n.timestamp'
  | `cmi.interactions.${number}.timestamp`
  | 'cmi.interactions.n.correct_responses._count'
  | `cmi.interactions.${number}.correct_responses._count`
  | 'cmi.interactions.n.correct_responses.n.pattern'
  | `cmi.interactions.${number}.correct_responses.${number}.pattern`
  | 'cmi.interactions.n.weighting'
  | `cmi.interactions.${number}.weighting`
  | 'cmi.interactions.n.learner_response'
  | `cmi.interactions.${number}.learner_response`
  | 'cmi.interactions.n.result'
  | `cmi.interactions.${number}.result`
  | 'cmi.interactions.n.latency'
  | `cmi.interactions.${number}.latency`
  | 'cmi.interactions.n.description'
  | `cmi.interactions.${number}.description`
  | 'cmi.launch_data'
  | 'cmi.learner_id'
  | 'cmi.learner_name'
  | 'cmi.learner_preference._children'
  | 'cmi.learner_preference.audio_level'
  | 'cmi.learner_preference.language'
  | 'cmi.learner_preference.delivery_speed'
  | 'cmi.learner_preference.audio_captioning'
  | 'cmi.location'
  | 'cmi.max_time_allowed'
  | 'cmi.mode'
  | 'cmi.objectives._children'
  | 'cmi.objectives._count'
  | 'cmi.objectives.n.id'
  | `cmi.objectives.${number}.id`
  | 'cmi.objectives.n.score._children'
  | `cmi.objectives.${number}.score._children`
  | 'cmi.objectives.n.score.scaled'
  | `cmi.objectives.${number}.score.scaled`
  | 'cmi.objectives.n.score.raw'
  | `cmi.objectives.${number}.score.raw`
  | 'cmi.objectives.n.score.min'
  | `cmi.objectives.${number}.score.min`
  | 'cmi.objectives.n.score.max'
  | `cmi.objectives.${number}.score.max`
  | 'cmi.objectives.n.success_status'
  | `cmi.objectives.${number}.success_status`
  | 'cmi.objectives.n.completion_status'
  | `cmi.objectives.${number}.completion_status`
  | 'cmi.objectives.n.progress_measure'
  | `cmi.objectives.${number}.progress_measure`
  | 'cmi.objectives.n.description'
  | `cmi.objectives.${number}.description`
  | 'cmi.progress_measure'
  | 'cmi.scaled_passing_score'
  | 'cmi.score._children'
  | 'cmi.score.scaled'
  | 'cmi.score.raw'
  | 'cmi.score.min'
  | 'cmi.score.max'
  | 'cmi.session_time'
  | 'cmi.success_status'
  | 'cmi.suspend_data'
  | 'cmi.time_limit_action'
  | 'cmi.total_time'
  | 'adl.data._count'
  | 'adl.data.n.id'
  | `adl.data.${number}.id`
  | 'adl.data.n.store'
  | `adl.data.${number}.store`
  | 'adl.nav.request'
  | 'adl.nav.request_valid.continue'
  | 'adl.nav.request_valid.previous'
  | `adl.nav.request_valid.choice.{target=${string}}`
  | `adl.nav.request_valid.jump.{target=${string}}`;

export type CMIErrorCode = string;
export type ScormBooleanResult = boolean | string;

export interface IScorm1_2 {
  /**
   * Begins a communication session with the LMS.
   */
  LMSInitialize(msg: string): ScormBooleanResult;
  /**
   * Ends a communication session with the LMS.
   */
  LMSFinish(msg: string): ScormBooleanResult;
  /**
   * Retrieves a value from the LMS.
   */
  LMSGetValue(element: CMIElement1_2): string;
  /**
   * Saves a value to the LMS.
   */
  LMSSetValue(element: CMIElement1_2, value: string): ScormBooleanResult;
  /**
   * Indicates to the LMS that all data should be persisted (not required).
   */
  LMSCommit(msg: string): ScormBooleanResult;
  /**
   * Returns the error code that resulted from the last API call.
   */
  LMSGetLastError(): CMIErrorCode;
  /**
   * Returns a short string describing the specified error code.
   */
  LMSGetErrorString(errorCode: CMIErrorCode): string;
  /**
   * Returns detailed information about the last error that occurred.
   */
  LMSGetDiagnostic(errorCode: CMIErrorCode): string;
}

export interface IScorm2004 {
  /**
   * Begins a communication session with the LMS.
   */
  Initialize(msg: string): ScormBooleanResult;
  /**
   * Ends a communication session with the LMS.
   */
  Terminate(msg: string): ScormBooleanResult;
  /**
   * Retrieves a value from the LMS.
   */
  GetValue(element: CMIElement2004): string;
  /**
   * Saves a value to the LMS.
   */
  SetValue(element: CMIElement2004, value: string): ScormBooleanResult;
  /**
   * Indicates to the LMS that all data should be persisted (not required).
   */
  Commit(msg: string): ScormBooleanResult;
  /**
   * Returns the error code that resulted from the last API call.
   */
  GetLastError(): CMIErrorCode;
  /**
   * Returns a short string describing the specified error code.
   */
  GetErrorString(errorCode: CMIErrorCode): string;
  /**
   * Returns detailed information about the last error that occurred.
   */
  GetDiagnostic(errorCode: CMIErrorCode): string;
}

export type IScorm<T extends availableVersions> = T extends '1.2'
  ? IScorm1_2
  : T extends '2004'
    ? IScorm2004
    : IScorm1_2 | IScorm2004;
export type CMIElement<T extends availableVersions> = T extends '1.2'
  ? CMIElement1_2
  : T extends '2004'
    ? CMIElement2004
    : CMIElement1_2 | CMIElement2004;
export type CompletionStatus<T extends availableVersions> = T extends '1.2'
  ? Scorm12LessonStatus
  : T extends '2004'
    ? Scorm2004CompletionStatus
    : Scorm12LessonStatus | Scorm2004CompletionStatus;

export interface IScormProps<T extends availableVersions = 'auto'> {
  /**
   * Version of scorm used
   */
  version?: T;
  /**
   * Whether or not debug mode is enabled
   */
  debug?: boolean;
  /**
   * Whether or not the wrapper should automatically handle the initial completion status
   *
   * @default true
   */
  handleCompletionStatus?: boolean;
  /**
   * Whether or not the wrapper should automatically handle the exit mode
   *
   * @default true
   */
  handleExitMode?: boolean;
  /**
   * Whether or not the each action automatically saves
   */
  autoCommit?: boolean;
  /**
   * Use this SCORM API object instead of searching parent windows, e.g. `bridge.api` from `@blocdigital/usescorm/bridge`
   */
  api?: IScorm1_2 | IScorm2004;
}

export interface IScormClass<T extends availableVersions = 'auto'> {
  /**
   * Version of scorm used
   */
  version: T extends 'auto' ? availableVersions : T;
  /**
   * Whether or not the wrapper should automatically handle the initial completion status
   *
   * @default true
   */
  handleCompletionStatus: boolean;
  /**
   * Whether or not the wrapper should automatically handle the exit mode
   *
   * @default true
   */
  handleExitMode: boolean;
  /**
   * Whether or not the each action automatically saves
   */
  autoCommit: boolean;
  /**
   * Live version of data that is in suspend_data
   */
  storage: unknown;
  /**
   * Direct access to SCORM API
   */
  API: {
    /**
     * Stored version of SCORM API
     */
    handle: null | IScorm<T>;
    /**
     * Whether the SCORM API has been detected or not
     */
    isFound: boolean;
    /**
     * Find a copy of SCORM
     *
     * @param win the window
     */
    find(win: Window): null | IScorm<T>;
    /**
     * Find a copy of SCORM (using current window)
     */
    get(): null | IScorm<T>;
    /**
     * Find a copy of SCORM (using current window + update handle)
     */
    getHandle(): null | IScorm<T>;
  };
  /**
   * Stored information about the connection
   */
  connection: {
    /**
     * Whether the connection to the SCORM API is active
     */
    isActive: boolean;
  };
  /**
   * Course Statuses
   */
  data: {
    /**
     * Current Course completion status
     */
    completionStatus: CompletionStatus<T>;
    /**
     * Course Exit status
     */
    exitStatus: boolean;
  };
  debug: {
    /**
     * Whether or not debug mode is enabled
     */
    isActive: boolean;
    /**
     * Returns the error code that resulted from the last API call
     *
     * @returns ErrorCode
     */
    getCode(): number | undefined;
    /**
     * Returns a short string describing the specified error code
     *
     * @param {number} error code to lookup
     * @returns error description
     */
    getInfo(error: number): string | undefined;
    /**
     * Returns detailed information about the last error that occurred.
     *
     * @param error code to lookup
     * @returns Diagnosis
     */
    getDiagnosticInfo(error: number): string | undefined;
  };
  /**
   * Begins a communication session with the LMS.
   */
  init(): boolean;
  /**
   * Ends a communication session with the LMS.
   */
  terminate(): boolean;
  /**
   * Retrieves a value from the LMS.
   *
   * @param parameter name of parameter to update
   */
  get(parameter: CMIElement<T>): string;
  /**
   * Saves a value to the LMS.
   *
   * @param parameter name of parameter to update
   * @param value new value
   */
  set(parameter: CMIElement<T>, value: string): boolean;
  /**
   * Store data in suspense data
   *
   * @param value data to be stored or callback function to create data
   */
  store(value: unknown | ((value: unknown) => unknown)): boolean;
  /**
   * Saves a value to the LMS.
   */
  save(): boolean;
  /**
   * Update the lesson status
   *
   * @param action get or set
   * @param status next status
   */
  status(action: 'get'): CompletionStatus<T>;
  status(action: 'set', status: CompletionStatus<T>): boolean;
  /** Subscribe to typed runtime events, optionally using an AbortSignal for cleanup. */
  addEventListener<K extends keyof ScormEvents>(
    event: K,
    callback: (event: CustomEvent<ScormEvents[K]>) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;
  /** Remove a listener using the same callback and capture setting. */
  removeEventListener<K extends keyof ScormEvents>(
    event: K,
    callback: (event: CustomEvent<ScormEvents[K]>) => void,
    options?: boolean | EventListenerOptions,
  ): void;
  /** Compatibility alias for addEventListener. */
  on: (event: ScormEventType, callback: ScormListener, options?: boolean | AddEventListenerOptions) => void;
  /** Compatibility alias for addEventListener('any', callback, options). */
  onAny: (callback: ScormAnyListener, options?: boolean | AddEventListenerOptions) => void;
  /** Compatibility alias for removeEventListener. */
  off: (event: ScormEventType, callback: ScormListener, options?: boolean | EventListenerOptions) => void;
  /** Compatibility alias for removeEventListener('any', callback, options). */
  offAny: (callback: ScormAnyListener, options?: boolean | EventListenerOptions) => void;
}

declare global {
  interface Window {
    API?: IScorm1_2;
    API_1484_11?: IScorm2004;
  }
}

/**
 * Convert data type to boolean
 * @param {unknown} value any data
 * @returns {boolean} converted value
 */
export const parseBool = (value: unknown): boolean =>
  value === true || value === 1 || (typeof value === 'string' && ['true', '1'].includes(value.trim().toLowerCase()));

/**
 * Count Unicode code points to match SCORM suspend-data character limits.
 *
 * @param str string to be used
 * @returns number of characters
 */
const calculateStringLength = (str: string): number => Array.from(str).length;

type ScormEventType = 'init' | 'set' | 'storage';
type ScormEvents = Record<ScormEventType, unknown> & {
  any: { event: ScormEventType; data: unknown };
};
type ScormListener = (event: CustomEvent<unknown>) => void;
type ScormAnyListener = (event: CustomEvent<{ event: ScormEventType; data: unknown }>) => void;

export class ScormInstance<T extends availableVersions = 'auto'> implements IScormClass<T> {
  private _version: IScormClass<T>['version'];
  private _handleCompletionStatus: boolean;
  private _handleExitMode: boolean;
  private _autoCommit: boolean;
  private readonly _api?: IScorm1_2 | IScorm2004;

  private readonly eventTarget = new TypedEventTarget<ScormEvents>();

  get version() {
    return this._version;
  }

  get handleCompletionStatus() {
    return this._handleCompletionStatus;
  }

  get handleExitMode() {
    return this._handleExitMode;
  }

  get autoCommit() {
    return this._autoCommit;
  }

  get storage() {
    const _storage = this.get('cmi.suspend_data' as CMIElement<T>);

    return _storage ? JSON.parse(_storage) : null;
  }

  API: IScormClass<T>['API'] = {
    handle: null,
    isFound: false,
    find: this.scormApiFind.bind(this),
    get: this.scormApiGet.bind(this),
    getHandle: this.scormApiGetHandle.bind(this),
  };

  connection: IScormClass<T>['connection'] = { isActive: false };

  data: IScormClass<T>['data'] = {
    completionStatus: 'not attempted' as CompletionStatus<T>,
    exitStatus: false,
  };

  debug: IScormClass<T>['debug'] = {
    isActive: false,
    getCode: this.scormDebugGetCode.bind(this),
    getInfo: this.scormDebugGetInfo.bind(this),
    getDiagnosticInfo: this.scormDebugGetDiagnosticInfo.bind(this),
  };

  constructor({
    version,
    debug,
    handleCompletionStatus = true,
    handleExitMode = true,
    autoCommit = true,
    api,
  }: IScormProps<T>) {
    // Set up params
    this._version = (version ?? 'auto') as IScormClass<T>['version'];
    this.debug.isActive = Boolean(debug);
    this._handleCompletionStatus = handleCompletionStatus;
    this._handleExitMode = Boolean(handleExitMode);
    this._autoCommit = Boolean(autoCommit);
    this._api = api;
  }

  /**
   * only console.log if in debug mode
   *
   * @param message info to log
   */
  private log(...message: unknown[]) {
    if (this.debug.isActive) console.log(...message);
  }

  //----------------------------//
  //      SCORM Connection      //
  //----------------------------//

  init(): boolean {
    const { debug, data, connection } = this;

    const traceMsgPrefix = 'SCORM.connection.initialize ';

    this.log('connection.initialize called.');

    // if the connection is already active don't init
    if (connection.isActive) {
      this.log(`${traceMsgPrefix}aborted: Connection already active.`);
      return false;
    }

    if (!this.connection.isActive) {
      const API = this.API.getHandle();
      let success = false;

      if (API) {
        switch (this._version) {
          case '1.2':
            success = parseBool((API as IScorm1_2).LMSInitialize(''));
            break;
          case '2004':
            success = parseBool((API as IScorm2004).Initialize(''));
            break;
        }

        if (success) {
          const errorCode = debug.getCode();

          if (errorCode === 0) {
            this.connection.isActive = true;

            this.handleEvent('init', true);

            if (this._handleCompletionStatus) {
              data.completionStatus = this.status('get');
              const isNewAttempt =
                data.completionStatus === 'not attempted' ||
                (this.version === '2004' && data.completionStatus === 'unknown');

              if (isNewAttempt) {
                const updated = this.status('set', 'incomplete' as CompletionStatus<T>);

                if (updated && !this.autoCommit) this.save();
              }
            }
          } else {
            success = false;
            this.log(`${traceMsgPrefix}failed. 
  Error code: ${errorCode} 
  Error info: ${errorCode === undefined ? undefined : debug.getInfo(errorCode)}`);
          }
        } else {
          const errorCode = debug.getCode();

          if (errorCode !== undefined && errorCode !== 0) {
            this.log(`${traceMsgPrefix}failed. 
  Error code: ${errorCode} 
  Error info: ${debug.getInfo(errorCode)}`);
          } else {
            this.log(`${traceMsgPrefix}failed: The API returned false.`);
          }
        }
      } else {
        this.log(`${traceMsgPrefix}failed: API is null.`);
      }

      return success;
    }

    return false;
  }

  terminate() {
    const { debug, connection, handleExitMode, version, data } = this;
    const { completionStatus, exitStatus } = data;

    const traceMsgPrefix = 'SCORM.connection.terminate ';

    let success = false;

    if (connection.isActive) {
      const API = this.API.getHandle();
      let exitModeSuccess = true;

      if (API) {
        if (handleExitMode && !exitStatus) {
          const isComplete =
            version === '1.2'
              ? completionStatus === 'completed' || completionStatus === 'passed'
              : completionStatus === 'completed';

          if (!isComplete) {
            switch (version) {
              case '1.2':
                exitModeSuccess = this.setValue('cmi.core.exit' as CMIElement<T>, 'suspend', false);
                break;
              case '2004':
                exitModeSuccess = this.setValue('cmi.exit' as CMIElement<T>, 'suspend', false);
                break;
            }
          } else {
            switch (version) {
              case '1.2':
                exitModeSuccess = this.setValue('cmi.core.exit' as CMIElement<T>, 'logout', false);
                break;
              case '2004':
                exitModeSuccess = this.setValue('cmi.exit' as CMIElement<T>, 'normal', false);
                break;
            }
          }
        }

        const commitSuccess = this.version === '1.2' ? this.save() : true;

        if (commitSuccess) {
          let terminateSuccess = false;

          switch (this.version) {
            case '1.2':
              terminateSuccess = parseBool((API as IScorm1_2).LMSFinish(''));
              break;
            case '2004':
              terminateSuccess = parseBool((API as IScorm2004).Terminate(''));
              break;
          }

          if (terminateSuccess) {
            connection.isActive = false;
          } else {
            const errorCode = debug.getCode();
            this.log(`${traceMsgPrefix}failed. 
  Error code: ${errorCode} 
  Error info: ${errorCode === undefined ? undefined : debug.getInfo(errorCode)}`);
          }

          success = exitModeSuccess && terminateSuccess;
        } else {
          success = false;
        }
      } else {
        this.log(`${traceMsgPrefix}failed: API is null.`);
      }
    } else {
      this.log(`${traceMsgPrefix}aborted: Connection already terminated.`);
    }

    return success;
  }

  //----------------------------//
  //         SCORM Data         //
  //----------------------------//

  get(parameter: CMIElement<T>): string {
    const { debug, connection, version, data } = this;

    const traceMsgPrefix = "SCORM.data.get('" + parameter + "') ";

    let value = '';

    if (connection.isActive) {
      const API = this.API.getHandle();

      if (API) {
        switch (version) {
          case '1.2':
            value = (API as IScorm1_2).LMSGetValue(parameter as CMIElement1_2);
            break;
          case '2004':
            value = (API as IScorm2004).GetValue(parameter as CMIElement2004);
            break;
        }

        const errorCode = debug.getCode();

        //GetValue returns an empty string on errors
        //If value is an empty string, check errorCode to make sure there are no errors
        if (value !== '' || errorCode === 0) {
          //GetValue is successful.
          //If parameter is lesson_status/completion_status or exit status, let's
          //grab the value and cache it so we can check it during connection.terminate()
          switch (parameter) {
            case 'cmi.core.lesson_status':
            case 'cmi.completion_status':
              data.completionStatus = value as CompletionStatus<T>;
              break;

            case 'cmi.core.exit':
            case 'cmi.exit':
              data.exitStatus = Boolean(value);
              break;
          }
        } else {
          this.log(`${traceMsgPrefix}failed. 
  Error code: ${errorCode} 
  Error info: ${errorCode === undefined ? undefined : debug.getInfo(errorCode)}`);
        }
      } else {
        this.log(`${traceMsgPrefix}failed: API is null.`);
      }
    } else {
      this.log(`${traceMsgPrefix}failed: API connection is inactive.`);
    }

    this.log(`${traceMsgPrefix} value: ${value}`);

    return value;
  }

  set(parameter: CMIElement<T>, value: string): boolean {
    return this.setValue(parameter, value, this._autoCommit);
  }

  private setValue(parameter: CMIElement<T>, value: string, commit: boolean): boolean {
    const { debug, connection, version, data } = this;

    const traceMsgPrefix = "SCORM.data.set('" + parameter + "') ";

    let success = false;

    if (connection.isActive) {
      const API = this.API.getHandle();

      if (API) {
        switch (version) {
          case '1.2':
            success = parseBool((API as IScorm1_2).LMSSetValue(parameter as CMIElement1_2, value));
            break;
          case '2004':
            success = parseBool((API as IScorm2004).SetValue(parameter as CMIElement2004, value));
            break;
        }

        if (success) {
          if (parameter === 'cmi.core.lesson_status' || parameter === 'cmi.completion_status') {
            data.completionStatus = value as CompletionStatus<T>;
          }

          this.handleEvent('set', { parameter, value });

          if (commit && !this.save()) success = false;
        } else {
          const errorCode = debug.getCode();

          this.log(`${traceMsgPrefix}failed. 
  Error code: ${errorCode} 
  Error info: ${errorCode === undefined ? undefined : debug.getInfo(errorCode)}`);
        }
      } else {
        this.log(`${traceMsgPrefix}failed: API is null.`);
      }
    } else {
      this.log(`${traceMsgPrefix}failed: API connection is inactive.`);
    }

    this.log(`${traceMsgPrefix} value: ${value}`);

    return success;
  }

  store(value: unknown): boolean {
    const { storage } = this;
    const _value = typeof value === 'function' ? value(storage) : value;
    const string = JSON.stringify(_value);

    if (string === undefined) {
      throw new TypeError('SCORM suspend data must be JSON-serializable.');
    }

    // if there is nothing to update give up
    if (string === JSON.stringify(storage)) return false;

    const size = calculateStringLength(string);
    const limit = this.version === '1.2' ? 4096 : 64000;

    if (size > limit) {
      console.warn(
        `SCORM ${this.version} has a suspend data limit of ${limit} characters,\nyour data is currently at ${size} characters and may not be stored correctly`,
      );
    }

    const success = this.set('cmi.suspend_data' as CMIElement<T>, string);

    if (!success) return false;

    this.handleEvent('storage', _value);

    return success;
  }

  save(): boolean {
    const { connection, version } = this;

    const traceMsgPrefix = 'SCORM.data.save failed';

    let success = false;

    if (connection.isActive) {
      const API = this.API.getHandle();

      if (API) {
        switch (version) {
          case '1.2':
            success = parseBool((API as IScorm1_2).LMSCommit(''));
            break;
          case '2004':
            success = parseBool((API as IScorm2004).Commit(''));
            break;
        }

        const errorCode = this.debug.getCode();

        if (success && errorCode !== 0) success = false;

        if (!success) {
          this.log(
            `${traceMsgPrefix}. Error code: ${errorCode}. Error info: ${
              errorCode === undefined ? undefined : this.debug.getInfo(errorCode)
            }`,
          );
        }
      } else {
        this.log(traceMsgPrefix + ': API is null.');
      }
    } else {
      this.log(traceMsgPrefix + ': API connection is inactive.');
    }

    return success;
  }

  //----------------------------//
  //        SCORM Status        //
  //----------------------------//

  status(action: 'get'): CompletionStatus<T>;
  status(action: 'set', status: CompletionStatus<T>): boolean;
  status(action: 'get' | 'set', status?: CompletionStatus<T>): CompletionStatus<T> | boolean {
    const { version } = this;

    const traceMsgPrefix = 'SCORM.getStatus failed';
    const cmi = (version === '1.2' ? 'cmi.core.lesson_status' : 'cmi.completion_status') as CMIElement<T>;

    if (!action) {
      this.log(traceMsgPrefix + ': action was not specified.');
      return false;
    }

    switch (action) {
      case 'get':
        return this.get(cmi) as CompletionStatus<T>;
      case 'set':
        if (!status) {
          this.log(traceMsgPrefix + ': status was not specified.');
          return false;
        }

        return this.set(cmi, status);
      default:
        this.log(traceMsgPrefix + ': no valid action was specified.');
        return false;
    }
  }

  //---------------------------//
  //         SCORM API         //
  //---------------------------//

  /**
   * Find a copy of SCORM
   *
   * @param win the window
   */
  private scormApiFind(win: Window): null | IScorm<T> {
    const findAttemptLimit = 500;
    const traceMsgPrefix = 'SCORM.API.find';

    let API: null | IScorm<T> = null;
    let findAttempts = 0;

    try {
      while (!win.API && !win.API_1484_11 && win.parent && win.parent !== win && findAttempts <= findAttemptLimit) {
        findAttempts++;
        win = win.parent;
      }

      //If SCORM version is specified by user, look for specific API
      if (this.version === '1.2' || this.version === '2004') {
        switch (this.version) {
          case '2004':
            if (!win.API_1484_11)
              throw new Error(
                `${traceMsgPrefix}: SCORM version 2004 was specified by user, but API_1484_11 cannot be found.`,
              );

            API = win.API_1484_11 as IScorm<T>;
            break;

          case '1.2':
            if (!win.API)
              throw new Error(`${traceMsgPrefix}: SCORM version 1.2 was specified by user, but API cannot be found.`);

            API = win.API as IScorm<T>;
            break;
        }
      } else {
        //If SCORM version not specified by user, look for APIs
        if (win.API_1484_11) {
          //SCORM 2004-specific API.
          this._version = '2004' as IScormClass<T>['version'];
          API = win.API_1484_11 as IScorm<T>;
        } else if (win.API) {
          //SCORM 1.2-specific API
          this._version = '1.2' as IScormClass<T>['version'];
          API = win.API as IScorm<T>;
        }
      }

      if (!API)
        throw new Error(`${traceMsgPrefix}: Error finding API. 
  Find attempts: ${findAttempts}
  Find attempt limit: ${findAttemptLimit}`);

      this.log(`${traceMsgPrefix}: API found. Version: ${this.version}`);
      this.log('API:', API);

      return API;
    } catch (err) {
      this.log(err);

      return null;
    }
  }

  /**
   * Find a copy of SCORM (using current window)
   */
  private scormApiGet(): null | IScorm<T> {
    if (this._api) return this.scormApiUseInjected(this._api);

    if (typeof window === 'undefined') return null;

    const win = window;

    try {
      const API: IScorm<T> | null =
        this.scormApiFind(win) ||
        (win.parent && win.parent !== win && this.scormApiFind(win.parent)) ||
        (win.top?.opener && this.scormApiFind(win.top.opener));

      if (!API) throw new Error("API.get failed: Can't find the API!");

      this.API.isFound = true;

      return API;
    } catch (err) {
      this.log(err);

      return null;
    }
  }

  /**
   * Use an API supplied through props, detecting its version from the method names.
   */
  private scormApiUseInjected(api: IScorm1_2 | IScorm2004): null | IScorm<T> {
    const detected = 'Initialize' in api ? '2004' : '1.2';

    if (this._version !== 'auto' && this._version !== detected) {
      this.log(`SCORM.API.get: SCORM ${this._version} was specified, but the supplied API is SCORM ${detected}.`);
      return null;
    }

    this._version = detected as IScormClass<T>['version'];
    this.API.isFound = true;

    return api as IScorm<T>;
  }

  /**
   * Find a copy of SCORM (using current window + update handle)
   */
  private scormApiGetHandle(): null | IScorm<T> {
    const { API } = this;

    if (!API.handle && !API.isFound) API.handle = this.scormApiGet();

    return API.handle;
  }

  //----------------------------//
  //        SCORM debug         //
  //----------------------------//

  /**
   * Returns the error code that resulted from the last API call
   *
   * @returns ErrorCode
   */
  private scormDebugGetCode(): number | undefined {
    const API = this.API.getHandle();

    // if there is no API give up
    if (!API) {
      this.log('SCORM.debug.getCode failed: API is null.');
      return;
    }

    switch (this.version) {
      case '1.2':
        return parseInt((API as IScorm1_2).LMSGetLastError(), 10);

      case '2004':
        return parseInt((API as IScorm2004).GetLastError(), 10);
    }
  }

  /**
   * Returns a short string describing the specified error code
   *
   * @param {number} errorCode code to lookup
   * @returns error description
   */
  private scormDebugGetInfo(errorCode: number): string | undefined {
    const API = this.API.getHandle();

    // if there is no API give up
    if (!API) {
      this.log('SCORM.debug.getInfo failed: API is null.');
      return;
    }

    switch (this.version) {
      case '1.2':
        return (API as IScorm1_2).LMSGetErrorString(errorCode.toString());

      case '2004':
        return (API as IScorm2004).GetErrorString(errorCode.toString());
    }
  }

  /**
   * Returns detailed information about the last error that occurred.
   *
   * @param errorCode code to lookup
   * @returns Diagnosis
   */
  private scormDebugGetDiagnosticInfo(errorCode: number) {
    const API = this.API.getHandle();

    // if there is no API give up
    if (!API) {
      this.log('SCORM.debug.getDiagnosticInfo failed: API is null.');
      return;
    }

    switch (this.version) {
      case '1.2':
        return (API as IScorm1_2).LMSGetDiagnostic(errorCode.toString());

      case '2004':
        return (API as IScorm2004).GetDiagnostic(errorCode.toString());
    }
  }

  //----------------------------//
  //       Storage Events       //
  //----------------------------//

  /**
   * Listen for an event and trigger a callback
   *
   * @param event event type
   * @param data data that was modified
   */
  private handleEvent(event: ScormEventType, data: unknown) {
    this.eventTarget.dispatchEvent(event, data);
    this.eventTarget.dispatchEvent('any', { event, data });
  }

  addEventListener<K extends keyof ScormEvents>(
    event: K,
    callback: (event: CustomEvent<ScormEvents[K]>) => void,
    options?: boolean | AddEventListenerOptions,
  ) {
    this.eventTarget.addEventListener(event, callback, options);
  }

  on(event: ScormEventType, callback: ScormListener, options?: boolean | AddEventListenerOptions) {
    this.addEventListener(event, callback, options);
  }

  onAny(callback: ScormAnyListener, options?: boolean | AddEventListenerOptions) {
    this.addEventListener('any', callback, options);
  }

  removeEventListener<K extends keyof ScormEvents>(
    event: K,
    callback: (event: CustomEvent<ScormEvents[K]>) => void,
    options?: boolean | EventListenerOptions,
  ) {
    this.eventTarget.removeEventListener(event, callback, options);
  }

  off(event: ScormEventType, callback: ScormListener, options?: boolean | EventListenerOptions) {
    this.removeEventListener(event, callback, options);
  }

  offAny(callback: ScormAnyListener, options?: boolean | EventListenerOptions) {
    this.removeEventListener('any', callback, options);
  }
}
