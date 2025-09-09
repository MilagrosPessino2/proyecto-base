import { useState, useCallback } from 'react';
import { createNovedadesDoc } from '../utilsWord/buildDocx';
import { downloadDoc } from '../utilsWord/downloadDocx';
import dataDefault from '../../data/novedadesRich'; 
import type { BuildDocRichInput } from '../utilsWord/types';
import { DOCX_FILENAME } from '../config/constants';

type UseNovedadesDownloadArgs = {
    filename?: string;
    inputOverride?: Omit<BuildDocRichInput, 'maxItemsPerSection'>;
};

export function useNovedadesDownload({
    filename = DOCX_FILENAME,
    inputOverride,
}: UseNovedadesDownloadArgs = {}) {
    const [loading, setLoading] = useState(false);

    const handleDownload = useCallback(async () => {
        try {
            setLoading(true);

            const input: BuildDocRichInput = inputOverride ?? {
                sectorGeneral: dataDefault.area,
                novedad: dataDefault.novedad, // ← debe ser SeccionAreaRich[]
                confidentialityLabel: 'YPF-Confidencial',
            };

            const doc = await createNovedadesDoc(input);
            await downloadDoc(doc, filename);
        } finally {
            setLoading(false);
        }
    }, [filename, inputOverride]);

    return { handleDownload, loading };
}
