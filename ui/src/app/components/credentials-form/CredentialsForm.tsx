import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { tw } from "../../../utils/tw";
import { api_client } from "../../../api_client";
import { useState } from "react";

export default function CredentialsForm() {
  const [res, set_res] = useState<object | null>(null);

  return res ? <pre>{JSON.stringify(res, null, 2)}</pre> : (
    <Formik
      initialValues={{
        credentials: "",
      }}
      validationSchema={Yup.object({
        credentials: Yup.string().matches(/\w+\n\S+\n\S+/, {
          message: "write API key, secret and passphrase in three lines",
        }),
      })}
      onSubmit={async (
        { credentials },
        { setSubmitting, setErrors, setValues },
      ) => {
        const [key, secret, passphrase] = credentials.split("\n");
        const payload = {
          key,
          secret,
          passphrase,
        };
        const res = await api_client.credentials.$post({
          json: payload,
        });
        if (res.status < 400) {
          const jRes = await res.json();

          set_res(jRes);
        } else {
          await setValues({ credentials: "" });
          setErrors({
            credentials: "Check your credentials... something went wrong",
          });
          setSubmitting(false);
        }
      }}
    >
      {(
        {
          isSubmitting,
          values,
          submitForm,
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
              placeholder={"key\nsecret\npassphrase"}
              type="password"
              name="credentials"
              onKeyDown={(ev: KeyboardEvent) => {
                if (
                  ev.key === "Enter" &&
                  values.credentials.split("\n").length === 3
                ) {
                  ev.preventDefault();
                  submitForm();
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
