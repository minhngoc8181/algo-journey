import java.util.*;

class Solution { int[] bubbleSort(int[] arr) { for (int i = 0; i < arr.length - 1; i++) for (int j = 0; j < arr.length - 1 - i; j++) if (arr[j] > arr[j+1]) { int t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t; } return arr; } }
