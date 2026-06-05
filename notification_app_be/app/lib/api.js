import logger from './logger';

export const generateSampleNotifications = () => {
  const now = Date.now();
  const HOUR = 60 * 60 * 1000;
  const DAY = 24 * HOUR;

  return [
    { id: "1", type: "placement", title: "Google — Offer Letter Released", message: "Congratulations! Your offer letter from Google is ready.", timestamp: new Date(now - 1 * HOUR).toISOString(), read: false },
    { id: "2", type: "placement", title: "Microsoft — Interview Scheduled", message: "Your final round interview is on Monday at 10 AM.", timestamp: new Date(now - 12 * HOUR).toISOString(), read: false },
    { id: "3", type: "placement", title: "Amazon — Application Accepted", message: "Your application for SDE-1 has been shortlisted.", timestamp: new Date(now - 2 * DAY).toISOString(), read: false },
    { id: "4", type: "placement", title: "Infosys — Offer Expired", message: "Your Infosys offer has expired. Contact TPO for details.", timestamp: new Date(now - 6 * DAY).toISOString(), read: false },
    { id: "5", type: "result", title: "Semester 6 Results Published", message: "Your SGPA for Semester 6 is 8.75. View full results.", timestamp: new Date(now - 2 * HOUR).toISOString(), read: false },
    { id: "6", type: "result", title: "Internal Assessment Marks Updated", message: "IA-2 marks for Data Structures have been uploaded.", timestamp: new Date(now - 1 * DAY).toISOString(), read: false },
    { id: "7", type: "result", title: "Revaluation Result — DBMS", message: "Your revaluation result for DBMS is now available.", timestamp: new Date(now - 3 * DAY).toISOString(), read: false },
    { id: "8", type: "result", title: "Lab Exam Grades Released", message: "Check your lab exam grades for this semester.", timestamp: new Date(now - 5 * DAY).toISOString(), read: true },
    { id: "9", type: "event", title: "Hackathon Registration Open", message: "Register for the 36-hour campus hackathon by Friday.", timestamp: new Date(now - 30 * 60 * 1000).toISOString(), read: false },
    { id: "10", type: "event", title: "Guest Lecture — AI in Healthcare", message: "Dr. Sharma will speak in Auditorium A at 3 PM today.", timestamp: new Date(now - 3 * HOUR).toISOString(), read: false },
    { id: "11", type: "event", title: "Sports Day Registrations", message: "Register for cricket, badminton, or athletics events.", timestamp: new Date(now - 4 * DAY).toISOString(), read: false },
    { id: "12", type: "event", title: "NSS Camp — Volunteer Signup", message: "NSS camp is scheduled for next week. Sign up now.", timestamp: new Date(now - 5 * DAY).toISOString(), read: false },
    { id: "13", type: "event", title: "Cultural Fest Auditions", message: "Auditions for dance and drama clubs this Saturday.", timestamp: new Date(now - 6 * DAY).toISOString(), read: false },
    { id: "14", type: "event", title: "Old Workshop Notification", message: "Python workshop held last month — resources uploaded.", timestamp: new Date(now - 8 * DAY).toISOString(), read: false },
  ];
};

const BASE_URL = "http://20.244.56.144/evaluation-service/notifications"; // Updated based on JWT audience

export const fetchNotifications = async ({ limit, page, type } = {}) => {
  try {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit);
    if (page) params.append('page', page);
    if (type && type !== 'all') params.append('notification type', type);

    const url = `${BASE_URL}?${params.toString()}`;
    
    // Attempt to fetch from the actual API with a short timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); 

    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyYW1haWFoNTQ5NkBnbWFpbC5jb20iLCJleHAiOjE3ODA2MzU2NjEsImlhdCI6MTc4MDYzNDc2MSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImMwZTkwZjlmLWRkYjctNGY3Mi04NmNiLTU4YzQ5MGM0MTBhYyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InZlbmthdGEgcmFtYWlhaCBtYXJ1cHVkaSIsInN1YiI6IjQ5OTRlOTM5LTdmNjgtNGQ0Yi04YWY4LTA5M2E4OTIwMDgyMCJ9LCJlbWFpbCI6InJhbWFpYWg1NDk2QGdtYWlsLmNvbSIsIm5hbWUiOiJ2ZW5rYXRhIHJhbWFpYWggbWFydXB1ZGkiLCJyb2xsTm8iOiIyM2JxMWEwNW44IiwiYWNjZXNzQ29kZSI6IlFRZEVZeSIsImNsaWVudElEIjoiNDk5NGU5MzktN2Y2OC00ZDRiLThhZjgtMDkzYTg5MjAwODIwIiwiY2xpZW50U2VjcmV0Ijoic2Z4S2JDY0V4dnVrVWF2UiJ9.W1fFe8e7WSfmIplHzyvMYeuBc_khB0XFDdvc7HAQl14',
        'accessCode': 'QQdEYy',
        'clientId': '4994e939-7f68-4d4b-8af8-093a89200820',
        'clientSecret': 'sfxKbCcExvukUavR'
      }
    });
    
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      logger.info('Successfully fetched notifications from real API');
      return data; 
    } else {
      throw new Error(`API returned status: ${response.status}`);
    }
  } catch (error) {
    // Fallback to mock data if the API is down/invalid
    logger.warn("Real API failed or timed out. Falling back to mock data.", { error: error.message });
    
    let mockData = generateSampleNotifications();

    if (type && type !== 'all') {
      mockData = mockData.filter(n => n.type === type);
    }
    
    if (limit && page) {
       const start = (page - 1) * limit;
       mockData = mockData.slice(start, start + limit);
    } else if (limit) {
       mockData = mockData.slice(0, limit);
    }

    return mockData;
  }
};
