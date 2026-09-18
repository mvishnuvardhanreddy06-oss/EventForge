/**
 * EventForge AI Studio Prompt Templates
 */

const getEventDescriptionPrompt = ({ title, theme, audience, category, keyTopics }) => {
  return `You are a world-class corporate conference strategist and copywriter.
Write a compelling, professional event description for an upcoming event with these details:
- Event Title: ${title}
- Category: ${category || 'Technology & Business'}
- Core Theme: ${theme || 'Corporate Innovation & Growth'}
- Target Audience: ${audience || 'Enterprise leaders, managers, and developers'}
- Key Topics: ${keyTopics || 'Leadership, Strategy, AI, Scale'}

Format the response with:
1. Hook & Overview (1-2 paragraphs)
2. Why Attend? (3-4 bullet points)
3. Who Should Join?
4. Key Takeaways
Ensure high professionalism, excitement, and clear business value.`;
};

const getSpeakerBioPrompt = ({ name, designation, company, expertise, achievements }) => {
  return `You are an executive talent curator.
Craft an engaging and authoritative speaker biography for an international conference program:
- Name: ${name}
- Designation: ${designation}
- Company: ${company}
- Areas of Expertise: ${expertise}
- Notable Achievements: ${achievements || 'Industry recognized thought leader and innovator'}

Provide:
1. Short Bio (50-70 words, suitable for event badges and quick schedules)
2. Extended Bio (150-200 words, suitable for event program website and press release)`;
};

const getSessionSummaryPrompt = ({ title, category, speakerName, keyPoints, durationMinutes }) => {
  return `Write a high-impact, actionable session overview for conference attendees:
- Session Title: ${title}
- Category: ${category}
- Speaker: ${speakerName}
- Duration: ${durationMinutes || 45} minutes
- Rough Topics: ${keyPoints}

Deliver:
- A crisp 2-sentence executive summary
- 3 actionable learning objectives (bullet points)
- Target attendee profile`;
};

const getAnnouncementPrompt = ({ eventTitle, type, details, urgency }) => {
  return `Draft a clear, courteous, and urgent conference broadcast message for attendees:
- Event: ${eventTitle}
- Announcement Category: ${type}
- Details/Change: ${details}
- Urgency: ${urgency || 'Normal'}

Format:
- Subject / Headline (punchy, within 10 words)
- Message body (within 80 words, clear next steps for attendees)`;
};

const getMarketingCopyPrompt = ({ eventTitle, date, venue, targetPlatform, perks }) => {
  return `Draft high-converting promotional marketing copy for:
- Event: ${eventTitle}
- Date & Location: ${date}, ${venue}
- Channel: ${targetPlatform || 'LinkedIn & Email Newsletter'}
- Key Perks: ${perks || 'World-class speakers, exclusive networking, certification'}

Include:
- Engaging headline
- Social media post copy with hashtags
- Compelling call-to-action (CTA)`;
};

const getRecommendationPrompt = ({ attendeeInterests, attendedSessions, availableSessions }) => {
  return `You are an intelligent conference concierge.
Analyze the attendee's profile:
- Attendee Interests: ${JSON.stringify(attendeeInterests)}
- Already Attended/Registered: ${JSON.stringify(attendedSessions)}
- Available Sessions: ${JSON.stringify(availableSessions)}

Recommend the top matching sessions. For each recommended session, output a JSON array of objects with:
{
  "sessionId": "<id>",
  "matchScore": <number between 70 and 99>,
  "reason": "<Concise 1-sentence personalized explanation linking their interests to the session>"
}
Return only valid JSON.`;
};

module.exports = {
  getEventDescriptionPrompt,
  getSpeakerBioPrompt,
  getSessionSummaryPrompt,
  getAnnouncementPrompt,
  getMarketingCopyPrompt,
  getRecommendationPrompt
};
