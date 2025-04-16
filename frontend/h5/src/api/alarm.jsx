import api from "./api";

export const sendAlarm = async (alarmDto) => {
    try {
        console.log("📢 알람 발송 : ", alarmDto);

        const response = await api.post("/alarm/",
            alarmDto
        );
        console.log("✅ 알람 발송 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error(
            "❌ 알람 발송 실패:",
            error.response ? error.response.data : error.message
        );
        throw error;
    }
};