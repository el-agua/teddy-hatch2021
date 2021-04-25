import { Formik, Field, FieldArray } from "formik";
import { FC } from "react"
import TextField from "./TextField";
import Select from "./Select"
import Router, { useRouter } from 'next/router'
import jwt_decode from "jwt-decode";
import Button from "./Button";
import Cookies from "js-cookie"
import patientService from "../services/patientService";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/outline"
import { redirect } from "next/dist/next-server/server/api-utils";
interface coolProps {
    user_id: number
    token: string
}
const HistoryForm: FC<coolProps> = (props) => {
    const router = useRouter()
    return (
        <Formik
            initialValues={{
                family: "",
                ethnicity: "",
                cancerDX: "",
                cancerDXType: "",
                cancerDXAge: "",
                relations: [{ relationship: '', cancer: '', age: '' }]
            }}
            onSubmit={(values, { setSubmitting }) => {

                patientService.CreatePatient(values, props.user_id, props.token).then(
                    (patient) => {
                        console.log(patient)
                        router.push('/dashboard')
                    }
                ).catch(() => Router.reload())

            }
            }
            validate={(values) => {
                const errors: any = {};
                if (!values.family) {
                    errors.family = "This field is required!"
                }
                if (!values.ethnicity) {
                    errors.ethnicity = "This field is required!"
                }
                if (!values.cancerDX) {
                    errors.cancerDX = "This field is required!"
                }
                if (values.family == "Yes") {
                    for (var i = 0; i < values.relations.length; i++) {
                        if (!values.relations[i]["relationship"]) {
                            errors.relations = "All relationship fields are required!";
                        }
                    }
                }

                return errors;
            }}
        >
            {({
                values,
                errors,
                touched,
                setFieldValue,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
            }) => (
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-5">
                        <div className="col-span-2">
                            <div className="mb-1"><strong>Have you been diagnosed with cancer in the past?</strong></div>
                            <div className="h-16">

                                <Field
                                    errors={errors.cancerDX && touched.cancerDX && errors.cancerDX}
                                    name="cancerDX"
                                    placeholder="Select"
                                    type="input"
                                    changeValue={(val: any) => {
                                        setFieldValue('cancerDX', val)
                                        if (val == "No") {
                                            setFieldValue('cancerDXType', '')
                                            setFieldValue('cancerDXAge', '')
                                        }
                                    }}
                                    choices={[
                                        {
                                            choice: "Yes",
                                            value: "Yes",
                                            color: "green-600",
                                        },
                                        {
                                            choice: "No",
                                            value: "No",
                                            color: "red-600",
                                        },
                                    ]}
                                    as={Select}
                                ></Field>
                                <div className="mt-1 text-xs m-px text-red-500">
                                    {errors.cancerDX && touched.cancerDX && errors.cancerDX}
                                </div>
                            </div>
                        </div>
                        {values.cancerDX == "Yes" ?
                            (<div className="col-span-2">
                                <div className="mb-1"><strong>What type of cancer were you diagnosed with?</strong></div>
                                <div className="h-16">

                                    <Field
                                        errors={errors.cancerDXType && touched.cancerDXType && errors.cancerDXType}
                                        name="cancerDXType"
                                        placeholder="Cancer Type"
                                        type="input"


                                        as={TextField}
                                    ></Field>
                                    <div className="mt-1 text-xs m-px text-red-500">
                                        {errors.cancerDXType && touched.cancerDXType && errors.cancerDXType}
                                    </div>
                                </div>
                            </div>) : ''}
                        {values.cancerDX == "Yes" ?
                            (<div className="col-span-2">
                                <div className="mb-1"><strong>At what age were you diagnosed?</strong></div>
                                <div className="h-16">

                                    <Field
                                        errors={errors.cancerDXAge && touched.cancerDXAge && errors.cancerDXAge}
                                        name="cancerDXAge"
                                        placeholder="Age of Diagnosis"
                                        type="input"


                                        as={TextField}
                                    ></Field>
                                    <div className="mt-1 text-xs m-px text-red-500">
                                        {errors.cancerDXAge && touched.cancerDXAge && errors.cancerDXAge}
                                    </div>
                                </div>
                            </div>) : ''
                        }
                        <div className="col-span-2">
                            <div className="mb-1"><strong>What is your ethnicity?</strong></div>
                            <div className="h-16">

                                <Field
                                    errors={errors.ethnicity && touched.ethnicity && errors.ethnicity}
                                    name="ethnicity"
                                    placeholder="Ethnicity"
                                    type="input"
                                    as={TextField}
                                ></Field>
                                <div className="mt-1 text-xs m-px text-red-500">
                                    {errors.ethnicity && touched.ethnicity && errors.ethnicity}
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <div className="mb-1"><strong>Does any of your intermediate family have a cancer diagnosis?</strong></div>
                            <div className="h-16">

                                <Field
                                    errors={errors.family && touched.family && errors.family}
                                    name="family"
                                    placeholder="Select"
                                    type="input"
                                    changeValue={(val: any) => {
                                        setFieldValue('family', val)
                                        if (val == "No") {
                                            setFieldValue('relations', [{ relationship: '', cancer: '', age: '' }])
                                        }
                                    }}
                                    choices={[
                                        {
                                            choice: "Yes",
                                            value: "Yes",
                                            color: "green-600",
                                        },
                                        {
                                            choice: "No",
                                            value: "No",
                                            color: "red-600",
                                        },
                                    ]}
                                    as={Select}
                                ></Field>
                                <div className="mt-1 text-xs m-px text-red-500">
                                    {errors.family && touched.family && errors.family}
                                </div>
                            </div>
                        </div>
                        {values.family == "Yes" ? <FieldArray
                            name="relations"
                            render={arrayHelpers => (
                                <div className="col-span-2">
                                    <div>
                                        {values.relations ? values.relations.map((relation, index) => (


                                            <div key={index}>
                                                {/** both these conventions do the same */}
                                                <div className="mb-1"><strong>Family Member {index + 1}</strong></div>
                                                <div className="grid grid-cols-8 gap-2">
                                                    <div className="col-span-6 row-span-2">

                                                        <div className="h-16">
                                                            <Field placeholder="Relationship" name={`relations[${index}].relationship`} as={TextField} />
                                                        </div>
                                                        <div className="h-16">
                                                            <Field placeholder="Cancer Type" name={`relations.${index}.cancer`} as={TextField} />
                                                        </div>
                                                        <div className="h-16">
                                                            <Field placeholder="Age of Diagnosis" name={`relations.${index}.age`} as={TextField} />
                                                        </div>
                                                    </div>
                                                    <div className="mb-3 flex justify-center col-span-2">

                                                        <Button padd="1" type="button" color="red-500" onClick={() => { if (values.relations.length != 1) { arrayHelpers.remove(index) } }}>
                                                            Remove
                          </Button>

                                                    </div>
                                                </div>

                                            </div>

                                        )) : <div></div>}
                                        <div className="flex justify-center">
                                            <Button

                                                padd="1"
                                                color="blue-500"
                                                type="button"
                                                onClick={() => arrayHelpers.push({ relationship: '', cancer: '', age: '' })}
                                            >
                                                Add
           </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        /> : <div></div>}

                        <div className="text-xs m-px text-red-500">
                            {errors.relations && touched.relations && errors.relations}
                        </div>
                    </div>



                    <div className="w-full grid mt-5">
                        <div className="flex justify-center">

                            <Button
                                color="green-300"
                                disabled={isSubmitting}
                                type="submit"
                            >
                                <div className="flex items-center">
                                    <ArrowRightIcon className="h-5 w-5"></ArrowRightIcon>
                                </div>
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </Formik>
    );
}

export default HistoryForm;