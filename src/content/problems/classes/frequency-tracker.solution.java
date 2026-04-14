class FrequencyTracker {
    private int[] counts;
    private int[] frequencies;

    public FrequencyTracker() {
        counts = new int[100001];
        frequencies = new int[100001];
    }
    
    public void add(int number) {
        int oldFreq = counts[number];
        if (oldFreq > 0) {
            frequencies[oldFreq]--;
        }
        counts[number]++;
        frequencies[counts[number]]++;
    }
    
    public void deleteOne(int number) {
        int oldFreq = counts[number];
        if (oldFreq > 0) {
            frequencies[oldFreq]--;
            counts[number]--;
            if (counts[number] > 0) {
                frequencies[counts[number]]++;
            }
        }
    }
    
    public boolean hasFrequency(int frequency) {
        if (frequency < 0 || frequency > 100000) return false;
        return frequencies[frequency] > 0;
    }
}
