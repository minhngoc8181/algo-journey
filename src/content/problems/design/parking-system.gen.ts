import { defineTests } from '../../_test-utils';

export default defineTests('parking-system', (t) => {
  t.visible('example-1', { 
    operations: [
      ['ParkingSystem', 1, 1, 0],
      ['addCar', 1],
      ['addCar', 2],
      ['addCar', 3],
      ['addCar', 1]
    ],
    expected: [null, true, true, false, false] 
  });

  t.hidden('all-zero', {
    operations: [
      ['ParkingSystem', 0, 0, 0],
      ['addCar', 1],
      ['addCar', 2],
      ['addCar', 3]
    ],
    expected: [null, false, false, false]
  });

  t.hidden('large-capacity', {
    operations: [
      ['ParkingSystem', 100, 100, 100],
      ['addCar', 1],
      ['addCar', 1],
      ['addCar', 1]
    ],
    expected: [null, true, true, true]
  });
});
