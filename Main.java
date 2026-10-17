import javax.swing.*;

public class Main {

    static final int NUM_DISCOS = 4;      // Cambia este valor (recomendado: 3 a 7)
    static final int RETARDO_MS = 500;    // Milisegundos entre movimientos

    public static void main(String[] args) {
        Torres torres = new Torres(NUM_DISCOS, RETARDO_MS);
        PanelHanoi panel = new PanelHanoi(torres, NUM_DISCOS);
        torres.setAlCambiar(panel::repaint);

        SwingUtilities.invokeLater(() -> {
            JFrame ventana = new JFrame("Torres de Hanoi (recursivo)");
            ventana.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            ventana.add(panel);
            ventana.pack();
            ventana.setLocationRelativeTo(null);
            ventana.setVisible(true);
        });

        // La recursión corre en otro hilo para no congelar la ventana
        new Thread(() -> {
            try {
                Thread.sleep(RETARDO_MS);
                torres.resolver(NUM_DISCOS, 0, 2, 1);   // A -> C usando B
                torres.marcarTerminado();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();
    }
}