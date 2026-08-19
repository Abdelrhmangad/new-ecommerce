"use client";

import { useLocale, useTranslations } from "next-intl";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/components/ui/accordion";

interface FAQItem {
	id: string;
	question: {
		en: string;
		ar: string;
	};
	answer: {
		en: string;
		ar: string;
	};
}

const FAQ_DATA: FAQItem[] = [
	{
		id: "faq-1",
		question: {
			en: "What is your shipping policy and delivery time?",
			ar: "ما هي سياسة الشحن ووقت التوصيل؟"
		},
		answer: {
			en: "We ship orders within 24-48 hours. Standard delivery takes 2 to 4 business days across all major governorates.",
			ar: "نقوم بشحن الطلبات خلال 24-48 ساعة. يستغرق التوصيل العادي من 2 إلى 4 أيام عمل في جميع المحافظات الرئيسية."
		}
	},
	{
		id: "faq-2",
		question: {
			en: "What is the return and exchange policy?",
			ar: "ما هي سياسة الاسترجاع والاستبدال؟"
		},
		answer: {
			en: "You can return or exchange any unworn item within 14 days of delivery in its original packaging with tags attached.",
			ar: "يمكنك إرجاع أو استبدال أي قطعة لم يتم ارتداؤها خلال 14 يوماً من الاستلام بتغليفها الأصلي ومعها التذاكر."
		}
	},
	{
		id: "faq-3",
		question: {
			en: "How do I choose the right size?",
			ar: "كيف يمكنني اختيار المقاس المناسب؟"
		},
		answer: {
			en: "Each product page features a size guide link with detailed chest, waist, and length measurements. Most of our apparel has a relaxed or oversized fit.",
			ar: "تتضمن كل صفحة منتج رابطاً لدليل المقاسات مع قياسات مفصلة للصدر، الخصر، والطول. معظم ملابسنا تأتي بقصة مريحة أو أوفرسيز."
		}
	},
	{
		id: "faq-4",
		question: {
			en: "What payment methods are accepted?",
			ar: "ما هي طرق الدفع المقبولة؟"
		},
		answer: {
			en: "We accept Cash on Delivery (COD) as well as secure online payments via major credit and debit cards.",
			ar: "نقبل الدفع عند الاستلام (COD) بالإضافة إلى المدفوعات الإلكترونية الآمنة عبر بطاقات الائتمان والخصم المباشر."
		}
	}
];

export default function FAQPage() {
	const locale = useLocale() as "en" | "ar";

	return (
		<main className="container mx-auto max-w-3xl px-4 py-12 min-h-[70dvh]">
			<div className="text-center mb-10">
				<h1 className="text-3xl font-bold tracking-tight">
					{locale === "ar"
						? "الأسئلة الشائعة"
						: "Frequently Asked Questions"}
				</h1>
				<p className="text-sm text-muted-foreground mt-2">
					{locale === "ar"
						? "كل ما تحتاج معرفته حول الشحن، المقاسات، والطلبات."
						: "Everything you need to know about shipping, sizing, and orders."}
				</p>
			</div>

			<Accordion className="w-full">
				{FAQ_DATA.map((item) => (
					<AccordionItem key={item.id} value={item.id}>
						<AccordionTrigger className="text-base font-medium text-start py-3">
							{item.question[locale]}
						</AccordionTrigger>
						<AccordionContent className="text-gray-400 text-base leading-relaxed">
							{item.answer[locale]}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</main>
	);
}
