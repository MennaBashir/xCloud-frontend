const authToken = import.meta.env.VITE_VIDEOSDK_TOKEN;

export const createMeeting = async (token: string): Promise<string> => {
	const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
		method: "POST",
		headers: {
			authorization: `${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({}),
	});

	const { roomId } = await res.json();
	return roomId;
};

export const getAuthToken = () => {
	return authToken;
};
