class ParkingSystem {
    private int[] spaces;

    public ParkingSystem(int big, int medium, int small) {
        spaces = new int[]{0, big, medium, small};
    }
    
    public boolean addCar(int carType) {
        if (spaces[carType] > 0) {
            spaces[carType]--;
            return true;
        }
        return false;
    }
}
