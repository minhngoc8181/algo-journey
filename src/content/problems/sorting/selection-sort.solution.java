import java.util.*;

class Solution { int[] selectionSort(int[] arr) { for (int i = 0; i < arr.length - 1; i++) { int mi = i; for (int j = i + 1; j < arr.length; j++) if (arr[j] < arr[mi]) mi = j; int t = arr[i]; arr[i] = arr[mi]; arr[mi] = t; } return arr; } }
