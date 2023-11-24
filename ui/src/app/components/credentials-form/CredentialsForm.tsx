import { ErrorMessage, Field, Form, Formik } from "formik";
import { tw } from "../../../utils/tw";
import * as Yup from "yup";

export default function CredentialsForm() {
  return (
    <Formik
      initialValues={{
        credentials: "",
      }}
      validationSchema={Yup.object({
        credentials: Yup.string().matches(/^\S+\nS+\n\S+$/, {
          message: "write API key, secret and passphrase in three lines",
        }),
      })}
      onSubmit={(data) => {
        console.log(data);
      }}
    >
      {(
        {
          isSubmitting,
          values,
          validateForm,
          submitForm,
          resetForm,
          setErrors,
        },
      ) => {
        return (
          <Form
            className={tw(
              "bg-green-300 flex flex-col justify-stretch items-start gap-2 p-2",
            )}
          >
            <Field
              as="textarea"
              rows={3}
              type="password"
              name="credentials"
              onKeyDown={async (ev: KeyboardEvent) => {
                if (ev.key !== "Enter") return;

                if (values.credentials.split("\n").length > 2) {
                  ev.preventDefault();
                  const { credentials } = await validateForm();

                  if (credentials) {
                    await resetForm();
                    setErrors({ credentials });
                  } else {
                    await submitForm();
                  }
                }
              }}
            />
            <ErrorMessage name="credentials" />
            <button
              className={tw(
                "px-2 border-2 rounded-full border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-100",
              )}
              type="submit"
              disabled={isSubmitting}
            >
              send
            </button>
          </Form>
        );
      }}
    </Formik>
  );
}
