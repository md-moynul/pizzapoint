// app/build/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Chip } from "@heroui/react";
import {
    ArrowLeft,
    ArrowRight,
    CircleCheckFill,
    ShoppingCart,
    Plus,
    Minus,
    TriangleExclamation,
} from "@gravity-ui/icons";
import { toast } from "react-toastify";

type Option = { id: string; label: string; price: number };

const BASES: Option[] = [
    { id: "thin-crust", label: "Thin Crust", price: 0 },
    { id: "hand-tossed", label: "Classic Hand-Tossed", price: 0 },
    { id: "deep-dish", label: "Deep Dish", price: 60 },
    { id: "whole-wheat", label: "Whole Wheat", price: 30 },
    { id: "cheese-burst", label: "Cheese Burst", price: 90 },
];

const SAUCES: Option[] = [
    { id: "tomato", label: "Classic Tomato", price: 0 },
    { id: "bbq", label: "BBQ", price: 20 },
    { id: "alfredo", label: "Alfredo (White Sauce)", price: 30 },
    { id: "pesto", label: "Pesto", price: 35 },
    { id: "peri-peri", label: "Spicy Peri-Peri", price: 25 },
];

const CHEESES: Option[] = [
    { id: "mozzarella", label: "Mozzarella", price: 0 },
    { id: "cheddar", label: "Cheddar", price: 20 },
    { id: "parmesan", label: "Parmesan", price: 40 },
    { id: "vegan", label: "Vegan Cheese", price: 50 },
    { id: "four-blend", label: "Four Cheese Blend", price: 80 },
];

const VEGETABLES: Option[] = [
    { id: "onion", label: "Onion", price: 10 },
    { id: "capsicum", label: "Capsicum", price: 10 },
    { id: "mushroom", label: "Mushroom", price: 20 },
    { id: "olives", label: "Olives", price: 20 },
    { id: "corn", label: "Corn", price: 15 },
    { id: "jalapeno", label: "Jalapeño", price: 15 },
    { id: "tomato", label: "Tomato", price: 10 },
    { id: "spinach", label: "Spinach", price: 15 },
];

const SIZES: { id: string; label: string; inches: number; multiplier: number }[] = [
    { id: "Small", label: "Small", inches: 6, multiplier: 1 },
    { id: "Medium", label: "Medium", inches: 8, multiplier: 1.25 },
    { id: "Large", label: "Large", inches: 12, multiplier: 1.5 },
];

const BASE_PRICE = 250; // starting price before add-ons, scaled by size

const STEPS = ["Base", "Sauce", "Cheese", "Vegetables", "Review"] as const;

const OptionGrid = ({
    options,
    selected,
    onSelect,
}: {
    options: Option[];
    selected: Option;
    onSelect: (o: Option) => void;
}) => (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((o) => {
            const isSelected = o.id === selected.id;
            return (
                <button
                    key={o.id}
                    type="button"
                    onClick={() => onSelect(o)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${isSelected ? "border-primary bg-primary/10" : "border-border hover:bg-surface"
                        }`}
                >
                    <span className={`text-sm font-medium ${isSelected ? "text-primary" : "text-text"}`}>
                        {o.label}
                    </span>
                    <span className="flex items-center gap-2">
                        {o.price > 0 && (
                            <span className="text-xs text-text-muted">+৳{o.price}</span>
                        )}
                        {isSelected && <CircleCheckFill width={16} height={16} className="text-primary" />}
                    </span>
                </button>
            );
        })}
    </div>
);

export default function BuildPizzaPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);

    const [base, setBase] = useState<Option>(BASES[0]);
    const [sauce, setSauce] = useState<Option>(SAUCES[0]);
    const [cheese, setCheese] = useState<Option>(CHEESES[0]);
    const [vegetables, setVegetables] = useState<Option[]>([]);
    const [size, setSize] = useState(SIZES[0]);
    const [quantity, setQuantity] = useState(1);
    const [status, setStatus] = useState<"idle" | "adding" | "success" | "error">("idle");

    const toppingsAddOn = useMemo(
        () => base.price + sauce.price + cheese.price + vegetables.reduce((s, v) => s + v.price, 0),
        [base, sauce, cheese, vegetables]
    );
    const unitPrice = useMemo(
        () => Math.round((BASE_PRICE + toppingsAddOn) * size.multiplier),
        [toppingsAddOn, size]
    );
    const totalPrice = unitPrice * quantity;

    const toggleVegetable = (veg: Option) => {
        setVegetables((prev) =>
            prev.some((v) => v.id === veg.id)
                ? prev.filter((v) => v.id !== veg.id)
                : [...prev, veg]
        );
    };

    const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
    const goBack = () => setStep((s) => Math.max(s - 1, 0));

    const handleAddToCart = async () => {
        toast.info("This feature is not available yet. Coming soon!");
        setStatus("adding");
        try {
            // Custom pizzas don't exist as a Pizza document yet — create one first,
            // then add it to the cart like any other pizza.
            const pizzaRes = await fetch("/api/pizzas/custom", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    base: base.id,
                    sauce: sauce.id,
                    cheese: cheese.id,
                    vegetables: vegetables.map((v) => v.id),
                    basePrice: BASE_PRICE + toppingsAddOn,
                }),
            });

            if (!pizzaRes.ok) throw new Error("Failed to save custom pizza");
            const pizza = await pizzaRes.json();

            const cartRes = await fetch("/api/cart/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pizzaId: pizza._id,
                    size: size.id,
                    inches: size.inches,
                    unitPrice,
                    quantity,
                }),
            });
            if (!cartRes.ok) throw new Error("Failed to add to cart");

            setStatus("success");
            router.push("/cart");
        } catch {
            setStatus("error");
        }
    };

    return (
        <div className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="mb-2 text-2xl font-semibold text-text">Build Your Pizza</h1>
            <p className="mb-8 text-sm text-text-muted">
                Pick your base, sauce, cheese, and toppings — your way.
            </p>

            {/* Step indicator */}
            <div className="mb-8 flex items-center gap-2">
                {STEPS.map((label, i) => (
                    <div key={label} className="flex flex-1 items-center gap-2">
                        <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${i < step
                                    ? "bg-primary text-white"
                                    : i === step
                                        ? "border-2 border-primary text-primary"
                                        : "border border-border text-text-muted"
                                }`}
                        >
                            {i < step ? <CircleCheckFill width={16} height={16} /> : i + 1}
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`h-0.5 flex-1 ${i < step ? "bg-primary" : "bg-border"}`} />
                        )}
                    </div>
                ))}
            </div>

            <Card>
                <Card.Content className="p-6">
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted">
                        {STEPS[step]}
                    </h2>

                    {step === 0 && <OptionGrid options={BASES} selected={base} onSelect={setBase} />}
                    {step === 1 && <OptionGrid options={SAUCES} selected={sauce} onSelect={setSauce} />}
                    {step === 2 && <OptionGrid options={CHEESES} selected={cheese} onSelect={setCheese} />}

                    {step === 3 && (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {VEGETABLES.map((veg) => {
                                const isSelected = vegetables.some((v) => v.id === veg.id);
                                return (
                                    <button
                                        key={veg.id}
                                        type="button"
                                        onClick={() => toggleVegetable(veg)}
                                        className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${isSelected ? "border-primary bg-primary/10" : "border-border hover:bg-surface"
                                            }`}
                                    >
                                        <span className={`text-sm font-medium ${isSelected ? "text-primary" : "text-text"}`}>
                                            {veg.label}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <span className="text-xs text-text-muted">+৳{veg.price}</span>
                                            {isSelected && (
                                                <CircleCheckFill width={16} height={16} className="text-primary" />
                                            )}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {step === 4 && (
                        <div className="flex flex-col gap-6">
                            {/* Summary */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-muted">Base</span>
                                    <span className="text-text">{base.label}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-muted">Sauce</span>
                                    <span className="text-text">{sauce.label}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-muted">Cheese</span>
                                    <span className="text-text">{cheese.label}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-muted">Vegetables</span>
                                    <span className="text-right text-text">
                                        {vegetables.length > 0
                                            ? vegetables.map((v) => v.label).join(", ")
                                            : "None"}
                                    </span>
                                </div>
                            </div>

                            {/* Size */}
                            <div className="border-t border-border pt-4">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                                    Size
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {SIZES.map((s) => {
                                        const isSelected = s.id === size.id;
                                        return (
                                            <button
                                                key={s.id}
                                                type="button"
                                                onClick={() => setSize(s)}
                                                className={`rounded-xl border px-4 py-2 text-left transition-colors ${isSelected ? "border-primary bg-primary/10" : "border-border hover:bg-surface"
                                                    }`}
                                            >
                                                <p className={`text-sm font-medium ${isSelected ? "text-primary" : "text-text"}`}>
                                                    {s.label}
                                                </p>
                                                <p className="text-xs text-text-muted">{s.inches}&quot;</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="flex items-center justify-between border-t border-border pt-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                                    Quantity
                                </p>
                                <div className="flex items-center gap-3 rounded-full border border-border px-2 py-1">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="flex h-7 w-7 items-center justify-center rounded-full text-text-muted hover:bg-surface hover:text-text"
                                    >
                                        <Minus width={14} height={14} />
                                    </button>
                                    <span className="w-5 text-center text-sm font-medium text-text">{quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((q) => q + 1)}
                                        className="flex h-7 w-7 items-center justify-center rounded-full text-text-muted hover:bg-surface hover:text-text"
                                    >
                                        <Plus width={14} height={14} />
                                    </button>
                                </div>
                            </div>

                            {status === "error" && (
                                <Chip color="danger" variant="soft">
                                    <TriangleExclamation width={16} height={16} />
                                    <Chip.Label>Couldn&apos;t add to cart. Try again.</Chip.Label>
                                </Chip>
                            )}

                            <div className="flex items-center justify-between border-t border-border pt-4">
                                <div>
                                    <p className="text-xs text-text-muted">Total</p>
                                    <p className="text-xl font-semibold text-accent">৳{totalPrice}</p>
                                </div>
                                <Button
                                    variant="primary"
                                    isPending={status === "adding"}
                                    className="bg-primary text-white"
                                    onPress={handleAddToCart}
                                >
                                    <ShoppingCart width={16} height={16} />
                                    Add to cart
                                </Button>
                            </div>
                        </div>
                    )}
                </Card.Content>
            </Card>

            {/* Step navigation */}
            {step < 4 && (
                <div className="mt-6 flex items-center justify-between">
                    <Button variant="outline" onPress={goBack} isDisabled={step === 0}>
                        <ArrowLeft width={16} height={16} />
                        Back
                    </Button>
                    <p className="text-sm text-text-muted">
                        Running total: <span className="font-semibold text-accent">৳{unitPrice}</span>
                    </p>
                    <Button variant="primary" onPress={goNext} className="bg-primary text-white">
                        Next
                        <ArrowRight width={16} height={16} />
                    </Button>
                </div>
            )}
            {step === 4 && (
                <div className="mt-6">
                    <Button variant="outline" onPress={goBack}>
                        <ArrowLeft width={16} height={16} />
                        Back
                    </Button>
                </div>
            )}
        </div>
    );
}