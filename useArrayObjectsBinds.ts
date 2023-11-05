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
    path: MaybeRefOrLazy<typeof arrayName>,
    config?:
      | Partial<ComponentBindsConfig<TValue, TExtras>>
      | LazyComponentBindsConfig<TValue, TExtras>
  ) => Ref<BaseComponentBinds<TValue> & TExtras>
) {
  type Row=Ref<(BaseComponentBinds<any> & { 'error-messages':string[] } )>;

  const binds = reactive<
   Array<{[k in `${typeof arrayName}[${number}].${Extract<keyof BaseObject, string>}`]:Row}>
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

//make composable from this, add it in useBinds package as second function
//take bind name(key), baseObject to generate the object defineComponentBinds
// const itemsBinds = ref([
//   {
//     count: (defineComponentBinds(`items[0].count` as any, {
//       mapProps: (state) => ({ 'error-messages': state.errors }),
//     })),
//     productId: (defineComponentBinds(`items[0].productId` as any, {
//       mapProps: (state) => ({ 'error-messages': state.errors })
//     })),
//     varianceName: (defineComponentBinds(`items[0].varianceName` as any, {
//       mapProps: (state) => ({ 'error-messages': state.errors })
//     }))
//   }, {
//     count: (defineComponentBinds(`items.1.count`, {
//       mapProps: (state) => ({ 'error-messages': state.errors })
//     })),
//     productId: (defineComponentBinds(`items.1.productId`, {
//       mapProps: (state) => ({ 'error-messages': state.errors })
//     })),
//     varianceName: (defineComponentBinds(`items.1.varianceName`, {
//       mapProps: (state) => ({ 'error-messages': state.errors })
//     }))
//   }
// ]);
// addItem()
// function addItem() {
//   itemsBinds.value.push(
//     {
//       count: ref(defineComponentBinds(`items.${values.items.length}`, {
//         mapProps: (state) => ({ 'error-messages': state.errors })
//       })),
//       productId: ref(defineComponentBinds(`items.${values.items.length}`, {
//         mapProps: (state) => ({ 'error-messages': state.errors })
//       })),
//       varianceName: ref(defineComponentBinds(`items.${values.items.length}`, {
//         mapProps: (state) => ({ 'error-messages': state.errors })
//       }))
//     }
//   );
// }
// function removeItem() {
//   itemsBinds.value.splice(itemsBinds.value.length - 1, 1)
// }
// const items = defineComponentBinds('items.0', {
//   mapProps: (state) => ({ 'error-messages': state.errors })
// })