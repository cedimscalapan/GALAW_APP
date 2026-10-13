from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path("public/assets/exercises")
SIZE = (360, 260)
BG = (7, 7, 7)
PANEL = (20, 18, 14)
GOLD = (214, 168, 60)
GOLD_2 = (240, 201, 107)
WHITE = (247, 244, 236)
MUTED = (148, 139, 124)


def ease(i, frames):
    half = frames // 2
    if i <= half:
        return i / half
    return 1 - ((i - half) / half)


def line(draw, pts, fill=WHITE, width=9):
    draw.line(pts, fill=fill, width=width, joint="curve")


def circle(draw, xy, r, fill=WHITE, outline=None, width=3):
    draw.ellipse((xy[0] - r, xy[1] - r, xy[0] + r, xy[1] + r), fill=fill, outline=outline, width=width)


def setup(title):
    img = Image.new("RGB", SIZE, BG)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((16, 16, 344, 244), radius=24, fill=PANEL, outline=(54, 43, 20), width=2)
    d.rounded_rectangle((26, 202, 334, 230), radius=14, fill=(11, 10, 8), outline=(58, 45, 20), width=1)
    try:
        font = ImageFont.truetype("arial.ttf", 17)
        small = ImageFont.truetype("arial.ttf", 11)
    except OSError:
        font = ImageFont.load_default()
        small = ImageFont.load_default()
    d.text((34, 206), title.upper(), fill=GOLD_2, font=font)
    d.text((34, 28), "TAMS FORM CUE", fill=MUTED, font=small)
    return img, d


def bar(draw, x1, y1, x2, y2):
    line(draw, [(x1, y1), (x2, y2)], GOLD_2, 7)
    circle(draw, (x1, y1), 9, GOLD)
    circle(draw, (x2, y2), 9, GOLD)


def draw_bench(draw, incline=False):
    if incline:
        line(draw, [(120, 166), (230, 128)], MUTED, 9)
    else:
        line(draw, [(108, 164), (246, 164)], MUTED, 9)
    line(draw, [(124, 166), (110, 194)], MUTED, 5)
    line(draw, [(232, 166), (250, 194)], MUTED, 5)


def bench_press(i, title="Barbell Bench Press", incline=False):
    p = ease(i, 8)
    img, d = setup(title)
    draw_bench(d, incline)
    y = 93 - p * 30
    if incline:
        head = (126, 130)
        hip = (212, 154)
        shoulder = (148, 128)
        knee = (244, 178)
    else:
        head = (118, 143)
        hip = (218, 154)
        shoulder = (145, 146)
        knee = (256, 174)
    circle(d, head, 13, WHITE)
    line(d, [shoulder, hip], WHITE, 9)
    line(d, [hip, knee, (272, 187)], WHITE, 8)
    line(d, [shoulder, (155, y), (206, y)], GOLD_2, 8)
    line(d, [(206, y), (220, 144)], GOLD_2, 8)
    bar(d, 108, y - 7, 252, y - 7)
    return img


def row(i):
    p = ease(i, 8)
    img, d = setup("Seated Cable Row")
    line(d, [(66, 158), (292, 158)], MUTED, 6)
    circle(d, (112, 126), 13, WHITE)
    shoulder = (126, 143)
    hip = (154, 170)
    foot = (228, 184)
    line(d, [shoulder, hip], WHITE, 9)
    line(d, [hip, (188, 180), foot], WHITE, 8)
    hand = (222 - p * 62, 141)
    line(d, [shoulder, (158, 144), hand], GOLD_2, 8)
    line(d, [(292, 112), hand], GOLD, 4)
    circle(d, (292, 112), 10, GOLD)
    return img


def pulldown(i):
    p = ease(i, 8)
    img, d = setup("Lat Pulldown")
    bar_y = 73 + p * 45
    line(d, [(88, 58), (272, 58)], MUTED, 5)
    line(d, [(180, 58), (180, bar_y)], GOLD, 3)
    bar(d, 111, bar_y, 249, bar_y)
    circle(d, (180, 132), 14, WHITE)
    line(d, [(180, 146), (180, 184)], WHITE, 9)
    line(d, [(180, 184), (158, 205)], WHITE, 8)
    line(d, [(180, 184), (202, 205)], WHITE, 8)
    line(d, [(146, bar_y), (164, 126)], GOLD_2, 8)
    line(d, [(214, bar_y), (196, 126)], GOLD_2, 8)
    return img


def squat(i):
    p = ease(i, 8)
    img, d = setup("Barbell Back Squat")
    y = 96 + p * 34
    circle(d, (181, y - 42), 13, WHITE)
    shoulder = (181, y - 24)
    hip = (181, y + 28)
    knee_l = (152, y + 60 - p * 8)
    knee_r = (210, y + 60 - p * 8)
    line(d, [shoulder, hip], WHITE, 9)
    line(d, [hip, knee_l, (134, 202)], WHITE, 8)
    line(d, [hip, knee_r, (228, 202)], WHITE, 8)
    bar(d, 114, y - 28, 246, y - 28)
    line(d, [(146, y - 27), shoulder, (216, y - 27)], GOLD_2, 8)
    return img


def rdl(i):
    p = ease(i, 8)
    img, d = setup("Romanian Deadlift")
    hip_y = 136 + p * 18
    shoulder = (160 + p * 34, 102 + p * 38)
    hip = (176, hip_y)
    circle(d, (shoulder[0] - 8, shoulder[1] - 22), 13, WHITE)
    line(d, [shoulder, hip], WHITE, 9)
    line(d, [hip, (158, 197)], WHITE, 8)
    line(d, [hip, (207, 197)], WHITE, 8)
    hand_y = 142 + p * 38
    bar(d, 112, hand_y, 248, hand_y)
    line(d, [shoulder, (158, hand_y)], GOLD_2, 8)
    line(d, [shoulder, (204, hand_y)], GOLD_2, 8)
    return img


def ohp(i):
    p = ease(i, 8)
    img, d = setup("Overhead Press")
    y = 130 - p * 64
    circle(d, (180, 126), 13, WHITE)
    line(d, [(180, 140), (180, 184)], WHITE, 9)
    line(d, [(180, 184), (156, 204)], WHITE, 8)
    line(d, [(180, 184), (204, 204)], WHITE, 8)
    line(d, [(152, y), (166, 136)], GOLD_2, 8)
    line(d, [(208, y), (194, 136)], GOLD_2, 8)
    bar(d, 112, y, 248, y)
    return img


def curl(i):
    p = ease(i, 8)
    img, d = setup("Dumbbell Curl")
    circle(d, (180, 92), 13, WHITE)
    line(d, [(180, 106), (180, 166)], WHITE, 9)
    line(d, [(180, 166), (158, 204)], WHITE, 8)
    line(d, [(180, 166), (204, 204)], WHITE, 8)
    hand_y = 160 - p * 42
    line(d, [(160, 124), (152, hand_y)], GOLD_2, 8)
    line(d, [(200, 124), (208, hand_y)], GOLD_2, 8)
    circle(d, (148, hand_y), 9, GOLD)
    circle(d, (212, hand_y), 9, GOLD)
    return img


def plank(i):
    p = ease(i, 8)
    img, d = setup("Plank")
    y = 142 + p * 4
    circle(d, (104, y - 18), 13, WHITE)
    line(d, [(118, y - 8), (222, y + 5)], WHITE, 10)
    line(d, [(132, y + 2), (114, 184)], GOLD_2, 8)
    line(d, [(214, y + 5), (268, 184)], WHITE, 8)
    line(d, [(96, 188), (282, 188)], MUTED, 5)
    return img


EXERCISES = {
    "bench": lambda i: bench_press(i),
    "incline": lambda i: bench_press(i, "Incline Dumbbell Press", True),
    "row": row,
    "pulldown": pulldown,
    "squat": squat,
    "rdl": rdl,
    "ohp": ohp,
    "curl": curl,
    "plank": plank,
}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for exercise_id, renderer in EXERCISES.items():
        frames = [renderer(i) for i in range(8)]
        frames[0].save(
            OUT / f"{exercise_id}.gif",
            save_all=True,
            append_images=frames[1:],
            duration=120,
            loop=0,
            optimize=True,
        )
        print(f"created {OUT / f'{exercise_id}.gif'}")


if __name__ == "__main__":
    main()
