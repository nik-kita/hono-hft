import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { api_client } from "../../api_client";
import { tw } from "../../utils/tw";
import { Dispatch, KeyboardEvent, SetStateAction } from "react";

type Props = {
  set_connection_url: Dispatch<SetStateAction<string>>;
};

export default function CredentialsFrom({ set_connection_url }: Props) {
  return (
    <Formik
      initialValues={{
        credentials: "",
      }}
      validationSchema={Yup.object({
        credentials: Yup.string()
          .matches(
            /\S+\n\S+\n\S+/,
            {
              excludeEmptyString: true,
              message: "key, secret, passphrase - line by line",
            },
          )
          .required("Required"),
      })}
      validateOnChange
      validateOnBlur
      onSubmit={async (
        values,
        { setSubmitting, setValues, setErrors },
      ) => {
        const [key, secret, passphrase] = values.credentials.split("\n").map((
          l,
        ) => l.trim());
        await api_client.api.credentials.$post({
          json: {
            key,
            secret,
            passphrase,
          },
        }).then(async (res) => {
          if (res.status >= 400) {
            setSubmitting(false);
            setValues({ credentials: "" }).then(() => {
              setErrors({ credentials: res.statusText });
            });

            console.warn(res);
          } else {
            return res.json();
          }
        }).then((res) => {
          console.log(res);
          setSubmitting(true);
          set_connection_url(res!.connection_url!);
        });
      }}
    >
      {(formik) => (
        <Form
          className={tw("px-[10%] bg-green-400 flex flex-col content-start")}
          onSubmit={formik.handleSubmit}
        >
          <label htmlFor="credentials">
            {`Your API credentials`}
          </label>
          <Field
            className={tw("p-1 text-xs columns-3 overflow-hidden")}
            {...formik.getFieldProps("credentials")}
            placeholder={`key\nsecret\npassphrase`}
            type="password"
            as="textarea"
            rows={3}
            onKeyDown={(ev: KeyboardEvent) => {
              if (
                ev.key === "Enter" &&
                formik.values.credentials.split("\n").length > 2
              ) {
                ev.preventDefault();
                formik.handleSubmit();
              }
            }}
          />
          <ErrorMessage name={"credentials"} />
          <button
            className={tw(
              "hover:bg-slate-700 hover:text-slate-100 bg-slate-300",
            )}
            type="submit"
          >
            {"Submit"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
