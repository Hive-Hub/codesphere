export function formatSecondsToHHMMSS(totalSeconds: number): string {
  if (totalSeconds < 0) totalSeconds = 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (num: number) => num.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

export function formatTimestamp(isoString?: string): string {
  if (!isoString) return new Date().toLocaleTimeString();
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return new Date().toLocaleTimeString();
  }
}

export function getLanguageDefaultCode(language: 'python' | 'c' | 'java'): string {
  switch (language) {
    case 'python':
      return `# CodeSphere AI - Python Session\n# Write your solution below\n\ndef main():\n    print("Hello, CodeSphere!")\n\nif __name__ == "__main__":\n    main()\n`;
    case 'c':
      return `/* CodeSphere AI - C Session */\n#include <stdio.h>\n\nint main() {\n    printf("Hello, CodeSphere!\\n");\n    return 0;\n}\n`;
    case 'java':
      return `/* CodeSphere AI - Java Session */\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, CodeSphere!");\n    }\n}\n`;
    default:
      return `# Write code here\n`;
  }
}
