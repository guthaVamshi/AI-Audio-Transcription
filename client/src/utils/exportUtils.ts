export interface TranscriptionMessage {
  id: string;
  text: string;
  timestamp: Date;
  type: 'transcription' | 'system';
}

export interface ExportOptions {
  format: 'txt' | 'json' | 'csv' | 'srt';
  includeTimestamps: boolean;
  includeSystemMessages: boolean;
}

export const exportTranscription = (
  messages: TranscriptionMessage[],
  options: ExportOptions
): string => {
  const filteredMessages = options.includeSystemMessages 
    ? messages 
    : messages.filter(msg => msg.type === 'transcription');

  switch (options.format) {
    case 'txt':
      return exportAsTxt(filteredMessages, options.includeTimestamps);
    case 'json':
      return exportAsJson(filteredMessages);
    case 'csv':
      return exportAsCsv(filteredMessages, options.includeTimestamps);
    case 'srt':
      return exportAsSrt(filteredMessages);
    default:
      return exportAsTxt(filteredMessages, options.includeTimestamps);
  }
};

const exportAsTxt = (messages: TranscriptionMessage[], includeTimestamps: boolean): string => {
  const header = 'AI Audio Transcription\n' + '='.repeat(30) + '\n\n';
  
  const content = messages.map(msg => {
    if (includeTimestamps) {
      return `[${msg.timestamp.toLocaleString()}] ${msg.text}`;
    }
    return msg.text;
  }).join('\n');
  
  return header + content;
};

const exportAsJson = (messages: TranscriptionMessage[]): string => {
  const exportData = {
    exportDate: new Date().toISOString(),
    totalMessages: messages.length,
    messages: messages.map(msg => ({
      id: msg.id,
      text: msg.text,
      timestamp: msg.timestamp.toISOString(),
      type: msg.type
    }))
  };
  
  return JSON.stringify(exportData, null, 2);
};

const exportAsCsv = (messages: TranscriptionMessage[], includeTimestamps: boolean): string => {
  const headers = includeTimestamps 
    ? ['Timestamp', 'Type', 'Text']
    : ['Type', 'Text'];
  
  const rows = messages.map(msg => {
    if (includeTimestamps) {
      return [
        msg.timestamp.toLocaleString(),
        msg.type,
        `"${msg.text.replace(/"/g, '""')}"`
      ];
    }
    return [
      msg.type,
      `"${msg.text.replace(/"/g, '""')}"`
    ];
  });
  
  return [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');
};

const exportAsSrt = (messages: TranscriptionMessage[]): string => {
  const transcriptionMessages = messages.filter(msg => msg.type === 'transcription');
  
  return transcriptionMessages.map((msg, index) => {
    const startTime = msg.timestamp;
    const endTime = new Date(startTime.getTime() + 3000); // 3 second duration
    
    const formatTime = (date: Date): string => {
      const hours = Math.floor(date.getTime() / 3600000);
      const minutes = Math.floor((date.getTime() % 3600000) / 60000);
      const seconds = Math.floor((date.getTime() % 60000) / 1000);
      const milliseconds = Math.floor((date.getTime() % 1000) / 10);
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${milliseconds.toString().padStart(2, '0')}`;
    };
    
    return `${index + 1}\n${formatTime(startTime)} --> ${formatTime(endTime)}\n${msg.text}\n`;
  }).join('\n');
};

export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
