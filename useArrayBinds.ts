import { Ref, computed, reactive } from 'vue'
import { BaseComponentBinds, ComponentBindsConfig, GenericObject, LazyComponentBindsConfig, MaybeRefOrLazy, Path, PathValue } from './vee-validate.types'
import { ObjectKeys } from './utils'

export function useArrayBinds(
  arrayName:string,
  defineComponentBinds: <
    TValue = (string|number|undefined|null)[],
    TExtras extends GenericObject = GenericObject,
  >(
    path: MaybeRefOrLazy<typeof arrayName>,
    config?:
      | Partial<ComponentBindsConfig<TValue, TExtras>>
      | LazyComponentBindsConfig<TValue, TExtras>
  ) => Ref<BaseComponentBinds<TValue> & TExtras>
) {
  type Row=Ref<(BaseComponentBinds<any> & { 'error-messages':string[] } )>;

  const binds = reactive<
   Array<Row>
>([]);
  const bindsLength = computed(()=>binds.length);

  const increment = ()=>{
    binds.push(
      defineComponentBinds(`${arrayName}[${bindsLength.value}]` as MaybeRefOrLazy<string>, {
        mapProps: (state) => ({ 'error-messages': state.errors })
      })
    )
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
