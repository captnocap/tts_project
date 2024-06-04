import sys
from piper import TTS

def generate_tts(text, output_file):
    tts = TTS('en_US')
    tts.synthesize(text, output_file)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python piper_tts.py <text> <output_file>")
        sys.exit(1)

    text = sys.argv[1]
    output_file = sys.argv[2]
    generate_tts(text, output_file)
