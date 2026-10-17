import java.util.ArrayList;
import java.util.List;

public class Torres {

    private final List<List<Integer>> torres = new ArrayList<>();
    private final int retardoMs;
    private Runnable alCambiar;          // avisa para que se repinte
    private int movimientos = 0;
    private boolean terminado = false;

    public Torres(int n, int retardoMs) {
        this.retardoMs = retardoMs;
        for (int i = 0; i < 3; i++) {
            torres.add(new ArrayList<>());
        }
        for (int disco = n; disco >= 1; disco--) {
            torres.get(0).add(disco);
        }
    }

    public void setAlCambiar(Runnable alCambiar) {
        this.alCambiar = alCambiar;
    }

    /** Algoritmo recursivo de las Torres de Hanoi. */
    public void resolver(int n, int origen, int destino, int auxiliar)
            throws InterruptedException {
        if (n == 0) {                                   // caso base
            return;
        }
        resolver(n - 1, origen, auxiliar, destino);     // 1) apartar n-1
        mover(origen, destino);                         // 2) mover el más grande
        resolver(n - 1, auxiliar, destino, origen);     // 3) volver a poner n-1
    }

    private void mover(int origen, int destino) throws InterruptedException {
        synchronized (this) {
            List<Integer> desde = torres.get(origen);
            int disco = desde.remove(desde.size() - 1);
            torres.get(destino).add(disco);
            movimientos++;
        }
        if (alCambiar != null) alCambiar.run();
        Thread.sleep(retardoMs);
    }

    public synchronized void marcarTerminado() {
        terminado = true;
        if (alCambiar != null) alCambiar.run();
    }

    // Métodos para que el panel lea el estado sin modificarlo
    public synchronized List<List<Integer>> copiaTorres() {
        List<List<Integer>> copia = new ArrayList<>();
        for (List<Integer> t : torres) {
            copia.add(new ArrayList<>(t));
        }
        return copia;
    }

    public synchronized int getMovimientos() { return movimientos; }

    public synchronized boolean isTerminado() { return terminado; }
}