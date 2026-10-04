def euler(f,t0, y0, h, t_end):
    t,y,= t0,y0
    while t<= t_end:
        print(f"{t:.2f} {y:.5f}")
        y= y+h*f(t,y)
        t=t+h