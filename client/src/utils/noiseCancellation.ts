import {
    RnnoiseWorkletNode,
    loadRnnoise,
} from "@sapphi-red/web-noise-suppressor";

export const processAudioWithRNNoise = async (
    rawStream: MediaStream,
    isNoiseCancellationOn: boolean
): Promise<{
    finalAudioTrack: MediaStreamTrack;
    cleanup: () => void;
}> => {
    let audioContext: AudioContext | null = null;
    let rnnoiseNode: RnnoiseWorkletNode | null = null;

    try {
        if (!isNoiseCancellationOn) {
            return {
                finalAudioTrack: rawStream.getAudioTracks()[0],
                cleanup: () => { },
            };
        }

        audioContext = new AudioContext({
            sampleRate: 48000,
        });

        await audioContext.audioWorklet.addModule(
            "/rnnoise/workletProcessor.js"
        );

        const wasmBinary = await loadRnnoise({
            url: "/rnnoise/rnnoise.wasm",
            simdUrl: "/rnnoise/rnnoise_simd.wasm",
        });

        const source =
            audioContext.createMediaStreamSource(rawStream);

        const destination =
            audioContext.createMediaStreamDestination();

        rnnoiseNode = new RnnoiseWorkletNode(
            audioContext,
            {
                wasmBinary,
                maxChannels: 1,
            }
        );

        source.connect(rnnoiseNode);
        rnnoiseNode.connect(destination);

        const finalAudioTrack =
            destination.stream.getAudioTracks()[0];

        return {
            finalAudioTrack,
            cleanup: () => {
                rnnoiseNode?.destroy();
                audioContext?.close();
            },
        };
    } catch (error) {
        console.error("RNNoise error:", error);

        return {
            finalAudioTrack: rawStream.getAudioTracks()[0],
            cleanup: () => { },
        };
    }
};