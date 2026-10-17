public class Hanoi {

    static int movimientos = 0;

    static void resolver(int n, char origen, char destino, char auxiliar) {
        if (n == 0) {                                   // caso base
            return;
        }
        resolver(n - 1, origen, auxiliar, destino);     // 1) apartar n-1
        movimientos++;
        System.out.println("Mover disco " + n + " de " + origen + " a " + destino);
        resolver(n - 1, auxiliar, destino, origen);     // 3) volver a poner n-1
    }

    public static void main(String[] args) {
        int n = 3;                                      // cambia este valor
        resolver(n, 'A', 'C', 'B');
        System.out.println("Total de movimientos: " + movimientos);
        System.out.println("Esperado (2^n - 1): " + ((1 << n) - 1));
    }
}