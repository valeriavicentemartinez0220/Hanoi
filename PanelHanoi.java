import javax.swing.*;
import java.awt.*;
import java.util.List;

public class PanelHanoi extends JPanel {

    static final int ANCHO = 600, ALTO = 320;
    static final int BASE_Y = 270, ALTO_DISCO = 20;
    static final int[] POSTES_X = {100, 300, 500};
    static final String[] NOMBRES = {"A", "B", "C"};
    static final Color[] COLORES = {
        new Color(0xe74c3c), new Color(0xe67e22), new Color(0xf1c40f),
        new Color(0x2ecc71), new Color(0x1abc9c), new Color(0x3498db),
        new Color(0x9b59b6), new Color(0x34495e)
    };

    private final Torres torres;
    private final int numDiscos;

    public PanelHanoi(Torres torres, int numDiscos) {
        this.torres = torres;
        this.numDiscos = numDiscos;
        setPreferredSize(new Dimension(ANCHO, ALTO));
        setBackground(Color.WHITE);
    }

    /** Solo dibuja el estado actual; no toma decisiones del algoritmo. */
    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g;
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                            RenderingHints.VALUE_ANTIALIAS_ON);

        List<List<Integer>> estado = torres.copiaTorres();
        int movimientos = torres.getMovimientos();
        boolean terminado = torres.isTerminado();

        g2.setStroke(new BasicStroke(3));
        g2.setColor(Color.BLACK);
        g2.drawLine(20, BASE_Y, ANCHO - 20, BASE_Y);
        g2.setStroke(new BasicStroke(1));

        for (int p = 0; p < 3; p++) {
            int x = POSTES_X[p];
            int altoPoste = (numDiscos + 1) * ALTO_DISCO;

            g2.setColor(new Color(0x8b4513));
            g2.fillRect(x - 4, BASE_Y - altoPoste, 8, altoPoste);

            g2.setColor(Color.BLACK);
            g2.setFont(new Font("Arial", Font.BOLD, 14));
            g2.drawString(NOMBRES[p], x - 5, BASE_Y + 20);

            List<Integer> torre = estado.get(p);
            for (int nivel = 0; nivel < torre.size(); nivel++) {
                int disco = torre.get(nivel);
                int ancho = 20 + disco * 20;
                int y = BASE_Y - (nivel + 1) * ALTO_DISCO;
                g2.setColor(COLORES[(disco - 1) % COLORES.length]);
                g2.fillRect(x - ancho / 2, y, ancho, ALTO_DISCO);
                g2.setColor(Color.BLACK);
                g2.drawRect(x - ancho / 2, y, ancho, ALTO_DISCO);
            }
        }

        g2.setFont(new Font("Arial", Font.PLAIN, 14));
        g2.drawString("Movimientos: " + movimientos, 10, 20);

        if (terminado) {
            g2.setColor(new Color(0x228b22));
            g2.setFont(new Font("Arial", Font.BOLD, 16));
            g2.drawString("¡Resuelto en " + movimientos + " movimientos!",
                          ANCHO / 2 - 130, 45);
        }
    }
}