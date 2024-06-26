import {CommandGroup, CommandItem, CommandList, CommandInput} from "@/components/ui/command"
import {Command as CommandPrimitive} from "cmdk"
import React, {useState, useRef, useCallback, type KeyboardEvent, FormEvent, useEffect, useContext} from "react"

import {cn} from "@/lib/utils"
import {Check, XIcon} from "lucide-react"
import {Skeleton} from "@/components/ui/skeleton";
import {ParentData} from "@/model/parent-data";
import {Button} from "@/components/ui/button";
import {ChildData, ChildNameData, RelativeParent} from "@/model/child-data";
import debounce from "@/utils/debounce";
import {format} from "date-fns";
import {TicketTypeData} from "@/model/ticket-type-data";
import AccessTokenContext from "@/context/access-token-context";
import {isStrictDate} from "@/utils/date";

type AutoCompleteProps<T> = {
    emptyMessage: string
    value?: T
    onValueChange?: (value: T | undefined) => void
    isLoading?: boolean
    disabled?: boolean
    placeholder?: string
    className?: string
    alreadyAddedData?: ChildNameData[] | RelativeParent[]
    isAdded: boolean
    getPotential: (name: string, limit: number, accessToken: string) => Promise<T[]>
    getLabelForItem: (item: T) => string
    getDescriptionForItem?: (item: T) => string
}

export const AutoComplete = <T extends ParentData | ChildNameData | ChildData | TicketTypeData>({
                                                                                                    alreadyAddedData,
                                                                                                    className,
                                                                                                    isAdded,
                                                                                                    placeholder,
                                                                                                    emptyMessage,
                                                                                                    value,
                                                                                                    onValueChange,
                                                                                                    disabled = false,
                                                                                                    isLoading = false,
                                                                                                    getPotential,
                                                                                                    getLabelForItem,
                                                                                                    getDescriptionForItem,
                                                                                                }: AutoCompleteProps<T>) => {
    const accessToken = useContext(AccessTokenContext)
    const inputRef = useRef<HTMLInputElement>(null)

    const [isOpen, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState<string | undefined>(value ? getLabelForItem(value) : undefined)
    const [options, setOptions] = useState<T[]>()

    useEffect(() => {
        setInputValue(value ? getLabelForItem(value) : undefined)
        if (isAdded) {
            setInputValue("")
            onValueChange?.(undefined)
            setOptions(undefined)
        }
    }, [isAdded, value]);
    const fetchPotential = useCallback((name: string) => {
        getPotential(name, 5, accessToken)
            .then(items => {
                const filteredItems = items.filter((item) =>
                    !alreadyAddedData?.some(
                        (addedItem) => addedItem.id === item.id
                    )
                );
                setOptions(filteredItems)
            })
            .catch(reason => {
                console.error("Failed to get potential items:", reason);
            });
    }, [alreadyAddedData]);

    function handleClear() {
        onValueChange?.(undefined)
        setInputValue("")
        setOptions(undefined)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedFetchPotential = useCallback(debounce(fetchPotential), [fetchPotential]);

    function handleOnInput(event: FormEvent<HTMLInputElement>) {
        const name = event.currentTarget.value
        setInputValue(name);
        if (name) {
            setOpen(name.length > 0);
            debouncedFetchPotential(name);
        } else {
            setOpen(false);
            setOptions(undefined);
            setInputValue(undefined)
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
        setInputValue(value ? getLabelForItem(value) : undefined)
    }, [value])

    const handleSelectOption = useCallback(
        (selectedOption: T) => {
            setInputValue(selectedOption ? getLabelForItem(selectedOption) : undefined)

            onValueChange?.(selectedOption)

            // This is a hack to prevent the input from being focused after the user selects an option
            // We can call this hack: "The next tick"
            setTimeout(() => {
                inputRef?.current?.blur()
            })
        },
        [onValueChange]
    )

    return (
        <div className={`relative ${className}`}>
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
                        onInput={handleOnInput}
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
                                {!!options?.length && (
                                    <CommandGroup>
                                        {options?.map((option) => {
                                            const isSelected = value?.id === option.id
                                            return (
                                                <CommandItem
                                                    key={option.id}
                                                    value={getLabelForItem(option)}
                                                    onMouseDown={(event) => {
                                                        event.preventDefault()
                                                        event.stopPropagation()
                                                    }}
                                                    onSelect={() => handleSelectOption(option)}
                                                    className={cn("flex items-center gap-2 w-full", !isSelected && "pl-8")}
                                                >
                                                    {isSelected ? <Check className="w-4"/> : null}
                                                    <div className="flex">
                                                        <div className="pr-2">
                                                            {getLabelForItem(option)}
                                                        </div>
                                                        {getDescriptionForItem && (
                                                            <div>
                                                                {
                                                                    !isStrictDate(getDescriptionForItem(option))
                                                                        ? getDescriptionForItem(option) :
                                                                        format(new Date(getDescriptionForItem(option)), "P")
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </CommandItem>
                                            )
                                        })}
                                    </CommandGroup>
                                )}
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
            {!disabled &&
                <Button
                    type="button"
                    variant="ghost"
                    className="absolute top-1 right-1 text-red-500 p-0 mt-1 mr-1 h-fit"
                    onClick={handleClear}
                >
                    <XIcon/>
                </Button>
            }
        </div>
    )
}
