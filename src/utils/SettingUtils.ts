export const getSettingId = (string: string) => {
    const words = string.toLowerCase().split(' ');
    const capitalizedWords = words.slice(1).map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return words[0].toLowerCase() + capitalizedWords.join('');
}
