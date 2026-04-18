class Counter {
    private int value;

    Counter(int start) {
        this.value = start;
    }

    void increment() {
        this.value++;
    }

    int getValue() {
        return this.value;
    }
}
