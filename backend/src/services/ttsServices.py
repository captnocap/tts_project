import sys
from tts import TTS  # Assume TTS is a Python module that handles TTS generation

def main(text, output_path, model):
    tts = TTS(model=model)  # Initialize TTS with the specified model
    tts.synthesize(text, output_path)

if __name__ == '__main__':
    text = sys.argv[1]
    output_path = sys.argv[2]
    model = sys.argv[3]
    main(text, output_path, model)
