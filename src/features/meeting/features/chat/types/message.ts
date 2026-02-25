export interface Message {
	id: string;
	message: string;
	payload: object;
	senderId: string;
	senderName: string;
	timestamp: string;
	topic: string;
}
