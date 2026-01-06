import { images } from "@/features/landing/assets";
import type { CarouselItem } from "../types/CarouselItem";

export const carouselItemsData: CarouselItem[] = [
	{
		img: images.fileServiceCardImg,
		title: "Smart File Hub",
		features: [
			{
				icon: images.cloud,
				text: "Upload and access files",
			},
			{
				icon: images.slidersHorizontal,
				text: "Files organization",
			},
			{
				icon: images.share,
				text: "Files sharing",
			},
			{
				icon: images.book,
				text: "AI summarization files",
			},
		],
	},
	{
		img: images.meetingServiceCardImg,
		title: "Meeting Room",
		features: [
			{
				icon: images.video,
				text: "Start and join meetings",
			},
			{
				icon: images.audio,
				text: "Auto-Recording sessions",
			},
			{
				icon: images.lightbulb,
				text: "AI summaries and task extraction",
			},
		],
	},
	{
		img: images.chatbotServiceCardImg,
		title: "AI Chatbot",
		features: [
			{
				icon: images.audio,
				text: "Auto-Recording Meetings",
			},
			{
				icon: images.play,
				text: "Video and files summarization",
			},
			{
				icon: images.lightbulb,
				text: "Key insights extraction",
			},
			{
				icon: images.book,
				text: "Making Quizzes",
			},
		],
	},
	{
		img: images.calendarServiceCardImg,
		title: "Calendar Creation",
		features: [
			{
				icon: images.calendar,
				text: "Create and update your calendar",
			},
			{
				icon: images.calendarPlus,
				text: "Add tasks",
			},
			{
				icon: images.slidersHorizontal,
				text: "Organize your schedule",
			},
		],
	},
	{
		img: images.mailServiceCardImg,
		title: "Mail Service",
		features: [
			{
				icon: images.mail,
				text: "Manage your emails",
			},
			{
				icon: images.send,
				text: "Send and schedule emails",
			},
		],
	},
	{
		img: images.chattingServiceCardImg,
		title: "Chatting and Contacts Creation",
		features: [
			{
				icon: images.speech,
				text: "Connected with your team",
			},
			{
				icon: images.frame,
				text: "Create contacts for collaboration",
			},
			{
				icon: images.users,
				text: "Invite your colleagues",
			},
		],
	},
];
