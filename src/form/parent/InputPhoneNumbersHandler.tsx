import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {fieldAppearance} from "@/components/fieldAppearance";
import {PlusSquare, XSquare} from "lucide-react";
import {FieldError, Merge} from "react-hook-form";

interface InputHandlerProps {
    value?: string[];
    onChange: (newValue: string[]) => void;
    errors: Merge<FieldError, (FieldError | undefined)[]>;
}

export function InputPhoneNumbersHandler({value, onChange, errors}: InputHandlerProps) {
    const [phoneNumbers, setPhoneNumbers] = useState(value || ['']);

    const handlePhoneNumberChange = (index: number, newValue: string) => {
        const newPhoneNumbers = [...phoneNumbers];
        newPhoneNumbers[index] = newValue;
        setPhoneNumbers(newPhoneNumbers);
        onChange(newPhoneNumbers.filter(Boolean));
    };

    const addPhoneNumberField = () => {
        setPhoneNumbers([...phoneNumbers, '']);
    };
    const removePhoneNumberField = (indexToRemove: number) => {
        if (indexToRemove !== 0) {
            const newPhoneNumbers = phoneNumbers.filter((_, index) => index !== indexToRemove);
            setPhoneNumbers(newPhoneNumbers);
            onChange(newPhoneNumbers.filter(Boolean));
        }
    };
    return (
        <>
            {phoneNumbers.map((phoneNumber, index) => (
                <div key={index}>
                    <div className={"flex items-center"}>
                        <Input
                            placeholder={index === 0 ? "Scheme: +36200000000" : "Optional Phone number"}
                            required={index === 0}
                            value={phoneNumber}
                            onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
                        />
                        {index !== 0 && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => removePhoneNumberField(index)}
                                style={{marginLeft: '8px'}}
                            >
                                <XSquare/>
                            </Button>
                        )}
                    </div>
                    <div className={"text-sm font-medium text-destructive mt-2"}>
                        {errors[index]?.message}
                    </div>
                </div>
            ))}
            <Button
                className={fieldAppearance}
                type={"button"}
                variant={"ghost"}
                onClick={addPhoneNumberField}
            >
                <PlusSquare/>
                Add additional phone numbers
            </Button>
        </>
    );
}
