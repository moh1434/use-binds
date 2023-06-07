# use-veeValidate-binds
This composable build form binds from veeValidate useForm() composable.

Usage example:
```vue
<script setup lang="ts">
const { handleSubmit, values, resetForm, defineComponentBinds } = useForm<ZodLoginSchemaType>({
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
```
