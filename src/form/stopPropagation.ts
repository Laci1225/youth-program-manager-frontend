import {FieldValues, UseFormHandleSubmit, UseFormReturn} from "react-hook-form";

export const handleSubmitStopPropagation = <TFieldValues extends FieldValues = FieldValues, TContext = any, TTransformedValues extends FieldValues | undefined = undefined>
(form: UseFormReturn<TFieldValues, TTransformedValues>): UseFormHandleSubmit<TFieldValues, TTransformedValues> =>
    (onValid, onInvalid) =>
        (e) => {
            if (e?.stopPropagation) {
                e.stopPropagation();
            }
            return form.handleSubmit(onValid, onInvalid)(e);
        }