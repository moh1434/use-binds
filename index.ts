import { Ref } from 'vue'
import { BaseComponentBinds, ComponentBindsConfig, GenericObject, LazyComponentBindsConfig, MaybeRefOrLazy, Path, PathValue } from './vee-validate.types'
import { ObjectKeys } from './utils'

/**
 * @example
  <script setup lang="ts">
  const { handleSubmit, values, resetForm, defineComponentBinds } = useForm<ZodSchemaType>({
  validationSchema,
  })
  const { formBinds } = useBinds(values, defineComponentBinds);
  </script>
  <template>
    <v-form>
      <v-text-field
        v-bind="formBinds.phone.value"
        label="Phone"
      />
      <v-text-field
        v-bind="formBinds.password.value"
        label="Password"
      />
    </v-form>
  </template>
 */
export function useBinds<
  TValues extends GenericObject = GenericObject
>(
  values: TValues,
  defineComponentBinds: <
    TPath extends Path<TValues>,
    TValue = PathValue<TValues, TPath>,
    TExtras extends GenericObject = GenericObject
  >(
    path: MaybeRefOrLazy<TPath>,
    config?:
      | Partial<ComponentBindsConfig<TValue, TExtras>>
      | LazyComponentBindsConfig<TValue, TExtras>
  ) => Ref<BaseComponentBinds<TValue> & TExtras>
) {
  //
  type FormType = {
    [k in keyof TValues]: Ref<
      BaseComponentBinds<PathValue<TValues, Path<TValues>>> & GenericObject
    >
  }
  const formBinds: FormType = {} as FormType

  ObjectKeys(values).forEach((field) => {
    formBinds[field] = defineComponentBinds(field as Path<TValues>, {
      mapProps: (state) => ({ 'error-messages': state.errors })
    })
  })

  return { formBinds }
}
