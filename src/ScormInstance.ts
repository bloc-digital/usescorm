export type availableVersions = '1.2' | '2004' | 'auto';
export type lesson_status = 'passed' | 'completed' | 'failed' | 'incomplete' | 'browsed' | 'not attempted' | 'unknown';

type CMIElement1_2 =
  | 'cmi.core._children'
  | 'cmi.core.student_id'
  | 'cmi.core.student_name'
  | 'cmi.core.lesson_location'
  | 'cmi.core.credit'
  | 'cmi.core.lesson_status'
  | 'cmi.core.entry'
  | 'cmi.core.score_children'
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
  | 'adl.nav.request'
  | 'adl.nav.request_valid.continue'
  | 'adl.nav.request_valid.previous'
  | `adl.nav.request_valid.choice.{target=}`
  | `adl.nav.request_valid.jump.{target=}`;

export type CMIErrorCode = string;

export interface IScorm1_2 {
  /**
   * Begins a communication session with the LMS.
   */
  LMSInitialize(msg: string): boolean;
  /**
   * Ends a communication session with the LMS.
   */
  LMSFinish(msg: string): boolean;
  /**
   * Retrieves a value from the LMS.
   */
  LMSGetValue(element: CMIElement1_2): string;
  /**
   * Saves a value to the LMS.
   */
  LMSSetValue(element: CMIElement1_2, value: string): string;
  /**
   * Indicates to the LMS that all data should be persisted (not required).
   */
  LMSCommit(msg: string): boolean;
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
  Initialize(msg: string): boolean;
  /**
   * Ends a communication session with the LMS.
   */
  Terminate(msg: string): boolean;
  /**
   * Retrieves a value from the LMS.
   */
  GetValue(element: CMIElement2004): string;
  /**
   * Saves a value to the LMS.
   */
  SetValue(element: CMIElement2004, value: string): string;
  /**
   * Indicates to the LMS that all data should be persisted (not required).
   */
  Commit(msg: string): boolean;
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

type IScorm<T> = T extends '1.2' ? IScorm1_2 : T extends '2004' ? IScorm2004 : IScorm1_2 & IScorm2004;
type CMIElement<T> = T extends '1.2'
  ? CMIElement1_2
  : T extends '2004'
    ? CMIElement2004
    : CMIElement1_2 & CMIElement2004;

export interface IScormProps<T> {
  /**
   * Version of scorm used
   */
  version?: T | availableVersions;
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
}

export interface IScormClass<T> {
  /**
   * Version of scorm used
   */
  version: IScormProps<T>['version'];
  /**
   * Whether or not the wrapper should automatically handle the initial completion status
   *
   * @default true
   */
  handleCompletionStatus: IScormProps<T>['handleCompletionStatus'];
  /**
   * Whether or not the wrapper should automatically handle the exit mode
   *
   * @default true
   */
  handleExitMode: IScormProps<T>['handleExitMode'];
  /**
   * Whether or not the each action automatically saves
   */
  autoCommit: IScormProps<T>['autoCommit'];
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
    completionStatus: lesson_status;
    /**
     * Course Exit status
     */
    exitStatus: boolean;
  };
  debug: {
    /**
     * Whether or not debug mode is enabled
     */
    isActive: IScormProps<T>['debug'];
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
  init(): boolean | undefined;
  /**
   * Ends a communication session with the LMS.
   */
  terminate(): boolean;
  /**
   * Retrieves a value from the LMS.
   *
   * @param parameter name of parameter to update
   */
  get(parameter: CMIElement<T> | string): string;
  /**
   * Saves a value to the LMS.
   *
   * @param parameter name of parameter to update
   * @param value new value
   */
  set(parameter: CMIElement<T> | string, value: string): boolean;
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
  status(action: 'get' | 'set', status?: lesson_status): boolean | lesson_status;
  /**
   * Add event listener for when this component is used.
   *
   * @param event name of event triggered by function
   * @param callback a callback function to be called when event matches
   *
   * @example scorm.on('set', (data) => {
   *   console.log(data)
   * })
   */
  on: (event: 'init' | 'set' | 'storage', callback: (data: unknown) => void) => void;
  /**
   * Add event listener, for all events, for when this component is used.
   *
   * @param callback a callback function to be called when any event is triggered
   *
   * @example scorm.onAny((key) => {
   *   const data = storage.get(key);
   *   console.log(data)
   * })
   */
  onAny: (callback: (data: unknown) => void) => void;
  /**
   * If you exactly match an `on` event you can remove it
   *
   * @param event matching event name
   * @param callback matching function
   */
  off: (event: 'init' | 'set' | 'storage', callback: (data: unknown) => void) => void;
  /**
   * If you exactly match an `onAny` function you can remove it
   *
   * @param callback matching function
   */
  offAny: (callback: (data: unknown) => void) => void;
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
const parseBool = (value: unknown): boolean => {
  switch (typeof value) {
    case 'object':
      return true;
    case 'string':
      return /(true|1)/i.test(value);
    case 'number':
      return !!value;
    case 'boolean':
      return value;
    default:
      return false;
  }
};

/**
 * Calculate the size of a string in bytes
 *
 * @param str string to be used
 * @returns size in bytes
 */
const calculateStringSizeInBytes = (str: string): number => {
  // Use the TextEncoder API to encode the string as UTF-8
  const encoder = new TextEncoder();
  const encodedString = encoder.encode(str);

  // The length of the encoded string represents the size in bytes
  return encodedString.length;
};

export class ScormInstance<T extends availableVersions = 'auto'> implements IScormClass<T> {
  private _version: IScormClass<T>['version'];
  private _handleCompletionStatus: IScormClass<T>['handleCompletionStatus'];
  private _handleExitMode: IScormClass<T>['handleExitMode'];
  private _autoCommit: IScormClass<T>['autoCommit'];

  private onList: { type: 'init' | 'set' | 'storage'; callback: (data: unknown) => void }[] = [];
  private onAnyList: { callback: (type: 'init' | 'set' | 'storage', data: unknown) => void }[] = [];

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
    completionStatus: 'not attempted',
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
  }: IScormProps<T>) {
    // Set up params
    this._version = version;
    this.debug.isActive = Boolean(debug);
    this._handleCompletionStatus = handleCompletionStatus;
    this._handleExitMode = Boolean(handleExitMode);
    this._handleExitMode = Boolean(handleExitMode);
    this._autoCommit = Boolean(autoCommit);
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

  init() {
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
      let errorCode = 0;
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
          //Double-check that connection is active and working before returning 'true' boolean
          errorCode = debug.getCode() as number;

          if (errorCode !== null && errorCode === 0) {
            this.connection.isActive = true;

            this.handleEvent('init', true);

            if (this._handleCompletionStatus) {
              //Automatically set new launches to incomplete
              data.completionStatus = this.status('get') as lesson_status;

              if (data.completionStatus) {
                switch (data.completionStatus) {
                  //Both SCORM 1.2 and 2004
                  case 'not attempted':
                    this.status('set', 'incomplete');
                    break;

                  //SCORM 2004 only
                  case 'unknown':
                    this.status('set', 'incomplete');
                    break;
                }

                //Commit changes
                this.save();
              }
            }
          } else {
            success = false;
            this.log(`${traceMsgPrefix}failed. 
  Error code: ${errorCode} 
  Error info: ${debug.getInfo(errorCode)}`);
          }
        } else {
          errorCode = debug.getCode() as number;

          if (errorCode !== null && errorCode !== 0) {
            this.log(`${traceMsgPrefix}failed. 
  Error code: ${errorCode} 
  Error info: ${debug.getInfo(errorCode)}`);
          } else {
            this.log(`${traceMsgPrefix}failed: No response from server.`);
          }
        }
      } else {
        this.log(`${traceMsgPrefix}failed: API is null.`);
      }

      return success;
    }
  }

  terminate() {
    const { debug, connection, handleExitMode, version, data } = this;
    const { completionStatus, exitStatus } = data;

    const traceMsgPrefix = 'SCORM.connection.terminate ';

    let success = false;

    if (connection.isActive) {
      const API = this.API.getHandle();
      let errorCode = 0;

      if (API) {
        if (handleExitMode && !exitStatus) {
          if (completionStatus !== 'completed' && completionStatus !== 'passed') {
            switch (version) {
              case '1.2':
                success = this.set('cmi.core.exit' as CMIElement<T>, 'suspend');
                break;
              case '2004':
                success = this.set('cmi.exit' as CMIElement<T>, 'suspend');
                break;
            }
          } else {
            switch (version) {
              case '1.2':
                success = this.set('cmi.core.exit' as CMIElement<T>, 'logout');
                break;
              case '2004':
                success = this.set('cmi.exit' as CMIElement<T>, 'normal');
                break;
            }
          }

          if (this.autoCommit) this.save();
        }

        //Ensure we persist the data for 1.2 - not required for 2004 where an implicit commit is applied during the Terminate
        success = this.version === '1.2' ? this.save() : true;

        if (success) {
          switch (this.version) {
            case '1.2':
              success = parseBool((API as IScorm1_2).LMSFinish(''));
              break;
            case '2004':
              success = parseBool((API as IScorm2004).Terminate(''));
              break;
          }

          if (success) {
            connection.isActive = false;
          } else {
            errorCode = debug.getCode() as number;
            this.log(`${traceMsgPrefix}failed. 
  Error code: ${errorCode} 
  Error info: ${debug.getInfo(errorCode)}`);
          }
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

  get(parameter: CMIElement<T>) {
    const { debug, connection, version, data } = this;

    const traceMsgPrefix = "SCORM.data.get('" + parameter + "') ";

    let value = null;

    if (connection.isActive) {
      const API = this.API.getHandle();
      let errorCode = 0;

      if (API) {
        switch (version) {
          case '1.2':
            value = (API as IScorm1_2).LMSGetValue(parameter as CMIElement1_2);
            break;
          case '2004':
            value = (API as IScorm2004).GetValue(parameter as CMIElement2004);
            break;
        }

        errorCode = debug.getCode() as number;

        //GetValue returns an empty string on errors
        //If value is an empty string, check errorCode to make sure there are no errors
        if (value !== '' || errorCode === 0) {
          //GetValue is successful.
          //If parameter is lesson_status/completion_status or exit status, let's
          //grab the value and cache it so we can check it during connection.terminate()
          switch (parameter) {
            case 'cmi.core.lesson_status':
            case 'cmi.completion_status':
              data.completionStatus = value as lesson_status;
              break;

            case 'cmi.core.exit':
            case 'cmi.exit':
              data.exitStatus = Boolean(value);
              break;
          }
        } else {
          this.log(`${traceMsgPrefix}failed. 
  Error code: ${errorCode} 
  Error info: ${debug.getInfo(errorCode)}`);
        }
      } else {
        this.log(`${traceMsgPrefix}failed: API is null.`);
      }
    } else {
      this.log(`${traceMsgPrefix}failed: API connection is inactive.`);
    }

    this.log(`${traceMsgPrefix} value: ${value}`);

    return String(value);
  }

  set(parameter: CMIElement<T>, value: string) {
    const { debug, connection, version, data } = this;

    const traceMsgPrefix = "SCORM.data.set('" + parameter + "') ";

    let success = false;

    if (connection.isActive) {
      const API = this.API.getHandle();
      let errorCode = 0;

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
            data.completionStatus = value as lesson_status;
          }

          this.handleEvent('set', { parameter, value });

          if (this._autoCommit) this.save();
        } else {
          errorCode = debug.getCode() as number;

          this.log(`${traceMsgPrefix}failed. 
  Error code: ${errorCode} 
  Error info: ${debug.getInfo(errorCode)}`);
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

    // if there is nothing to update give up
    if (string === JSON.stringify(storage)) return false;

    const size = calculateStringSizeInBytes(string);
    const limit = this.version === '1.2' ? 4096 : 64000;

    if (size >= limit) {
      console.warn(
        `SCORM ${this.version} has suspend data limit of ${limit}B,\nyour data is currently at ${size}B and may not be stored correctly`,
      );
    }

    const success = this.set('cmi.suspend_data' as CMIElement<T>, string);

    if (!success) return false;

    this.handleEvent('storage', _value);

    return this.autoCommit ? this.save() : success;
  }

  save() {
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

  status(action: 'get' | 'set', status?: lesson_status): lesson_status | boolean {
    const { version } = this;

    const traceMsgPrefix = 'SCORM.getStatus failed';
    const cmi = (version === '1.2' ? 'cmi.core.lesson_status' : 'cmi.completion_status') as CMIElement<T>;

    if (!action) {
      this.log(traceMsgPrefix + ': action was not specified.');
      return false;
    }

    switch (action) {
      case 'get':
        return this.get(cmi) as lesson_status;
      case 'set':
        if (!status) {
          this.log(traceMsgPrefix + ': status was not specified.');
          return false;
        }

        if (!this.autoCommit) return this.set(cmi, status);

        this.set(cmi, status);

        return this.save();
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

    while (!win.API && !win.API_1484_11 && win.parent && win.parent != win && findAttempts <= findAttemptLimit) {
      findAttempts++;
      win = win.parent;
    }

    //If SCORM version is specified by user, look for specific API
    if (this.version) {
      switch (this.version) {
        case '2004':
          if (win.API_1484_11) {
            API = win.API_1484_11 as IScorm<T>;
          } else {
            this.log(`${traceMsgPrefix}: SCORM version 2004 was specified by user, but API_1484_11 cannot be found.`);
          }

          break;

        case '1.2':
          if (win.API) {
            API = win.API as IScorm<T>;
          } else {
            this.log(`${traceMsgPrefix}: SCORM version 1.2 was specified by user, but API cannot be found.`);
          }

          break;
      }
    } else {
      //If SCORM version not specified by user, look for APIs

      if (win.API_1484_11) {
        //SCORM 2004-specific API.

        this._version = '2004' as T; //Set version
        API = win.API_1484_11 as IScorm<T>;
      } else if (win.API) {
        //SCORM 1.2-specific API

        this._version = '1.2' as T; //Set version
        API = win.API as IScorm<T>;
      }
    }

    if (API) {
      this.log(`${traceMsgPrefix}: API found. Version: ${this.version}`);
      this.log('API:', API);
    } else {
      this.log(`${traceMsgPrefix}: Error finding API. 
  Find attempts: ${findAttempts}
  Find attempt limit: ${findAttemptLimit}`);
    }

    return API;
  }

  /**
   * Find a copy of SCORM (using current window)
   */
  private scormApiGet(): null | IScorm<T> {
    const win = window;

    let API = this.scormApiFind(win);

    if (!API && win.parent && win.parent != win) {
      API = this.scormApiFind(win.parent);
    }

    if (!API && win.top && win.top.opener) {
      API = this.scormApiFind(win.top.opener);
    }

    //Special handling for Plateau
    //Thanks to Joseph Venditti for the patch
    if (!API && win.top && win.top.opener && win.top.opener.document) {
      API = this.scormApiFind(win.top.opener.document);
    }

    if (API) {
      this.API.isFound = true;
    } else {
      this.log("API.get failed: Can't find the API!");
    }

    return API;
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
  private handleEvent(event: 'init' | 'set' | 'storage', data: unknown) {
    this.onList.filter((obj) => obj.type === event).forEach((obj) => obj.callback(data));
    this.onAnyList.forEach((obj) => obj.callback(event, data));
  }

  on(event: 'init' | 'set' | 'storage', callback: (data: unknown) => void) {
    this.onList.push({ type: event, callback });
  }

  onAny(callback: (event: 'init' | 'set' | 'storage', data: unknown) => void) {
    this.onAnyList.push({ callback });
  }

  off(event: 'init' | 'set' | 'storage', callback: (data: unknown) => void) {
    const remove = this.onList.indexOf(this.onList.filter((e) => e.type === event && e.callback === callback)[0]);
    if (remove >= 0) this.onList.splice(remove, 1);
  }

  offAny(callback: (event: 'init' | 'set' | 'storage', data: unknown) => void) {
    const remove = this.onAnyList.indexOf(this.onAnyList.filter((e) => e.callback === callback)[0]);
    if (remove >= 0) this.onAnyList.splice(remove, 1);
  }
}
