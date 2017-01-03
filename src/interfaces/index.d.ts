import {AjaxResponse, AjaxError} from 'rxjs';
import {Reducer} from 'redux';

export interface Dict<T> {
  [name: string]: T;
}

export interface AnyDict extends Dict<any> {
}
export interface StringDict extends Dict<string> {
}
export interface BoolDict extends Dict<boolean> {
}
export interface ObjDict extends Dict<AnyDict> {
}

export type Partial<Fields> = {
  [Field in keyof Fields]?: Fields[Field];
};

export type OfType<Fields, TGoal> = {
  [Field in keyof Fields]: TGoal;
};

export type ReducersOfType<Fields> = {
  [Field in keyof Fields]: Reducer<Fields[Field]>;
};

interface CustomXHR<TResponse> extends XMLHttpRequest {
  readonly response: TResponse;
}

interface AjaxResponseTyped<TResponse> extends AjaxResponse {
  status: 200;
  response: TResponse;
}

interface AjaxErrorTyped<TResponse> extends AjaxError {
  xhr: CustomXHR<TResponse>;
}
