import { Ref, computed, reactive } from 'vue'
import { BaseComponentBinds, ComponentBindsConfig, GenericObject, LazyComponentBindsConfig, MaybeRefOrLazy, Path, PathValue } from './vee-validate.types'
import { ObjectKeys } from './utils'

export function useArrayObjectsBinds<
  BaseObject extends GenericObject = GenericObject
>(
  arrayName:string,
  baseObject:BaseObject,
  defineComponentBinds: <
    TValue = BaseObject[],
    TExtras extends GenericObject = GenericObject,
  >(
    path: any,
    config?:
      | Partial<ComponentBindsConfig<TValue, TExtras>>
      | LazyComponentBindsConfig<TValue, TExtras>
  ) => Ref<BaseComponentBinds<TValue> & TExtras>
) {
  type Row=Ref<(BaseComponentBinds<any> & { 'error-messages':string[] } )>;

  const binds = reactive<
   Array<{[k in keyof BaseObject]:Row}>
  >([]);
  const bindsLength = computed(()=>binds.length);

  const increment = ()=>{
    const temp ={} as {
      [k in keyof BaseObject]:Row
    };

    ObjectKeys(baseObject).forEach((field) => {
      temp[field] = defineComponentBinds(`${arrayName}[${bindsLength.value}].${field as string}` as MaybeRefOrLazy<string>, {
        mapProps: (state) => ({ 'error-messages': state.errors })
      })
    })

    binds.push(temp as any);
  };

  const decrement =()=>{
    binds.splice(bindsLength.value-1,1)
  }

  return {
    binds,
    bindsLength,
    increment,
    decrement,
  }
}
