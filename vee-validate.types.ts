import {  MaybeRef } from 'vue'

//START types (copied from vee-validate.d.ts)
type BrowserNativeObject = Date | FileList | File
type Primitive = null | undefined | string | number | boolean | symbol | bigint
type IsEqual<T1, T2> = T1 extends T2
  ? (<G>() => G extends T1 ? 1 : 2) extends <G>() => G extends T2 ? 1 : 2
    ? true
    : false
  : false
type AnyIsEqual<T1, T2> = T1 extends T2
  ? IsEqual<T1, T2> extends true
    ? true
    : never
  : never
type PathImpl<K extends string | number, V, TraversedTypes> = V extends
  | Primitive
  | BrowserNativeObject
  ? `${K}`
  : true extends AnyIsEqual<TraversedTypes, V>
  ? `${K}`
  : `${K}` | `${K}.${PathInternal<V, TraversedTypes | V>}`
type IsTuple<T extends ReadonlyArray<any>> = number extends T['length']
  ? false
  : true
type TupleKeys<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>
type ArrayKey = number
type PathInternal<T, TraversedTypes = T> = T extends ReadonlyArray<infer V>
  ? IsTuple<T> extends true
    ? {
        [K in TupleKeys<T>]-?: PathImpl<K & string, T[K], TraversedTypes>
      }[TupleKeys<T>]
    : PathImpl<ArrayKey, V, TraversedTypes>
  : {
      [K in keyof T]-?: PathImpl<K & string, T[K], TraversedTypes>
    }[keyof T]

export type GenericObject = Record<string, any>
export type MaybeRefOrLazy<T> = MaybeRef<T> | (() => T)
export type Path<T> = T extends any ? PathInternal<T> : never
type ArrayPath<T> = T extends any ? ArrayPathInternal<T> : never
type IsAny<T> = 0 extends 1 & T ? true : false
type ArrayPathImpl<K extends string | number, V, TraversedTypes> = V extends
  | Primitive
  | BrowserNativeObject
  ? IsAny<V> extends true
    ? string
    : never
  : V extends ReadonlyArray<infer U>
  ? U extends Primitive | BrowserNativeObject
    ? IsAny<V> extends true
      ? string
      : never
    : true extends AnyIsEqual<TraversedTypes, V>
    ? never
    : `${K}` | `${K}.${ArrayPathInternal<V, TraversedTypes | V>}`
  : true extends AnyIsEqual<TraversedTypes, V>
  ? never
  : `${K}.${ArrayPathInternal<V, TraversedTypes | V>}`
type ArrayPathInternal<T, TraversedTypes = T> = T extends ReadonlyArray<infer V>
  ? IsTuple<T> extends true
    ? {
        [K in TupleKeys<T>]-?: ArrayPathImpl<K & string, T[K], TraversedTypes>
      }[TupleKeys<T>]
    : ArrayPathImpl<ArrayKey, V, TraversedTypes>
  : {
      [K in keyof T]-?: ArrayPathImpl<K & string, T[K], TraversedTypes>
    }[keyof T]
export type PathValue<T, P extends Path<T> | ArrayPath<T>> = T extends any
  ? P extends `${infer K}.${infer R}`
    ? K extends keyof T
      ? R extends Path<T[K]>
        ? PathValue<T[K], R>
        : never
      : K extends `${ArrayKey}`
      ? T extends ReadonlyArray<infer V>
        ? PathValue<V, R & Path<V>>
        : never
      : never
    : P extends keyof T
    ? T[P]
    : P extends `${ArrayKey}`
    ? T extends ReadonlyArray<infer V>
      ? V
      : never
    : never
  : never
type InputType = 'checkbox' | 'radio' | 'default'
type SchemaValidationMode = 'validated-only' | 'silent' | 'force'
interface ValidationOptions$1 {
  mode: SchemaValidationMode
}
interface ValidationResult {
  errors: string[]
  valid: boolean
}
type FieldValidator = (
  opts?: Partial<ValidationOptions$1>
) => Promise<ValidationResult>
interface PathState<TValue = unknown> {
  id: number | number[]
  path: string
  touched: boolean
  dirty: boolean
  valid: boolean
  validated: boolean
  pending: boolean
  initialValue: TValue | undefined
  value: TValue | undefined
  errors: string[]
  bails: boolean
  label: string | undefined
  type: InputType
  multiple: boolean
  fieldsCount: number
  __flags: {
    pendingUnmount: Record<string, boolean>
  }
  validate?: FieldValidator
}
type PublicPathState<TValue = unknown> = Omit<
  PathState<TValue>,
  | 'bails'
  | 'label'
  | 'multiple'
  | 'fieldsCount'
  | 'validate'
  | 'id'
  | 'type'
  | '__flags'
>

export interface BaseComponentBinds<TValue = unknown> {
  modelValue: TValue | undefined
  'onUpdate:modelValue': (value: TValue) => void
  onBlur: () => void
}
export interface ComponentBindsConfig<
  TValue = unknown,
  TExtraProps extends GenericObject = GenericObject
> {
  mapProps: (state: PublicPathState<TValue>) => TExtraProps
  validateOnBlur: boolean
  validateOnModelUpdate: boolean
}
export type LazyComponentBindsConfig<
  TValue = unknown,
  TExtraProps extends GenericObject = GenericObject
> = (state: PublicPathState<TValue>) => Partial<{
  props: TExtraProps
  validateOnBlur: boolean
  validateOnModelUpdate: boolean
}>
//END types
