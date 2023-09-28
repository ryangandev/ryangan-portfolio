export function parseResponsibilitiesData(text: string) {
    const splitText = text.split(/\*\*(.+?)\*\*/g); // Split by the '**' markers
    return splitText.map((segment, index) =>
        index % 2 === 1 ? (
            <strong className="highlightedFontColor" key={index}>
                {segment}
            </strong>
        ) : (
            segment
        ),
    );
}
