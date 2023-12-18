"use client"

import {CommandGroup, CommandItem, CommandList, CommandInput} from "@/components/ui/command"
import {Command as CommandPrimitive} from "cmdk"
import React, {useState, useRef, useCallback, type KeyboardEvent, FormEvent} from "react"

import {cn} from "@/lib/utils"
import {Check, XIcon} from "lucide-react"
import {Skeleton} from "@/components/ui/skeleton";
import {ParentData} from "@/model/parent-data";
import getPotentialParents from "@/api/graphql/child/getPotentialParents";
import {Button} from "@/components/ui/button";


type AutoCompleteProps = {
    emptyMessage: string
    value?: ParentData
    onValueChange?: (value: ParentData | undefined) => void
    isLoading?: boolean
    disabled?: boolean
    placeholder?: string
}

export const AutoComplete = ({
                                 placeholder,
                                 emptyMessage,
                                 value,
                                 onValueChange,
                                 disabled,
                                 isLoading = false,
                             }: AutoCompleteProps) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const [isOpen, setOpen] = useState(false)
    const [selected, setSelected] = useState<ParentData | undefined>(value as ParentData)
    const [inputValue, setInputValue] = useState<string | undefined>(value ? `${value.familyName} ${value.givenName}` : undefined)
    const [options, setOptions] = useState<ParentData[]>()

    function potentialParents(event: FormEvent<HTMLInputElement>) {
        const name = event.currentTarget.value
        setInputValue(name);
        if (name) {
            setOpen(name.length > 0);
            setTimeout(() => {
                getPotentialParents(name)
                    .then(value => setOptions(value))
                    .catch(reason => {
                        console.error("Failed to get potential parents:", reason);
                    });
            }, 500);
        } else {
            setOpen(false);
            setOptions(undefined);
        }
    }

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current
            if (!input) {
                return
            }
            // Keep the options displayed when the user is typing
            if (!isOpen) {
                setOpen(true)
            }

            // This is not a default behaviour of the <input /> field
            if (event.key === "Enter" && input.id !== "") {
                const optionToSelect = options?.find((option) => option.id === input.id)
                if (optionToSelect) {
                    setSelected(optionToSelect)
                    onValueChange?.(optionToSelect)
                }
            }

            if (event.key === "Escape") {
                input.blur()
            }
        },
        [isOpen, options, onValueChange]
    )

    const handleBlur = useCallback(() => {
        setOpen(false)
        setInputValue(selected ? `${selected.familyName} ${selected.givenName}` : undefined)
    }, [selected])

    const handleSelectOption = useCallback(
        (selectedOption: ParentData) => {
            setInputValue(selectedOption ? `${selectedOption.familyName} ${selectedOption.givenName}` : undefined)

            setSelected(selectedOption)
            onValueChange?.(selectedOption)

            // This is a hack to prevent the input from being focused after the user selects an option
            // We can call this hack: "The next tick"
            setTimeout(() => {
                inputRef?.current?.blur()
            }, 0)
        },
        [onValueChange]
    )

    return (
        <div className={"relative"}>
            <CommandPrimitive onKeyDown={handleKeyDown}>
                <div>
                    <CommandInput
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={isLoading ? undefined : setInputValue}
                        onBlur={handleBlur}
                        onFocus={() => setOpen(true)}
                        placeholder={placeholder}
                        disabled={disabled}
                        className="text-base"
                        onInput={potentialParents}
                    />
                </div>
                <div className="mt-1 relative">
                    {isOpen ? (
                        <div
                            className="absolute top-0 z-10 w-full rounded-xl bg-stone-50 outline-none animate-in fade-in-0 zoom-in-95">
                            <CommandList className="ring-1 ring-slate-200 rounded-lg">
                                {isLoading ? (
                                    <CommandPrimitive.Loading>
                                        <div className="p-1">
                                            <Skeleton className="h-8 w-full"/>
                                        </div>
                                    </CommandPrimitive.Loading>
                                ) : null}
                                {options && options.length > 0 && !isLoading ? (
                                    <CommandGroup>
                                        {options.map((option) => {
                                            const isSelected = selected?.id === option.id
                                            return (
                                                <CommandItem
                                                    key={option.id}
                                                    value={option ? `${option.familyName} ${option.givenName}` : undefined}
                                                    onMouseDown={(event) => {
                                                        event.preventDefault()
                                                        event.stopPropagation()
                                                    }}
                                                    onSelect={() => handleSelectOption(option)}
                                                    className={cn("flex items-center gap-2 w-full", !isSelected ? "pl-8" : null)}
                                                >
                                                    {isSelected ? <Check className="w-4"/> : null}
                                                    {option.familyName} {option.givenName} {option.phoneNumbers[0]}
                                                </CommandItem>
                                            )
                                        })}
                                    </CommandGroup>
                                ) : null}
                                {!isLoading ? (
                                    <CommandPrimitive.Empty
                                        className="select-none rounded-sm px-2 py-3 text-sm text-center">
                                        {emptyMessage}
                                    </CommandPrimitive.Empty>
                                ) : null}
                            </CommandList>

                        </div>
                    ) : null}
                </div>
            </CommandPrimitive>
            <Button
                type="button"
                variant={"ghost"}
                className="absolute top-1 right-1 text-red-500 p-0 mt-1 mr-1 h-fit"
                onClick={() => {
                    onValueChange?.(undefined)
                    setInputValue("")
                    setSelected(undefined)
                    setOptions(undefined)
                }}
            >
                <XIcon/>
            </Button>
        </div>
    )
}