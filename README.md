# use-veeValidate-binds
This composable build form binds from veeValidate useForm() composable.

Usage example:

`
npm i use-binds
`
or:
`
pnpm add use-binds
`
```vue
<script setup lang="ts">
import { useBinds } from 'use-binds';

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
