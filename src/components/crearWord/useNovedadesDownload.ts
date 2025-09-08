import { useState, useCallback } from 'react';
import { createNovedadesDoc } from '../utilsWord/buildDoc';
import { downloadDoc } from '../utilsWord/downloadDoc';
import dataDefault from '../../data/mockNovedades';
import type { BuildDocInput } from '../utilsWord/types';
import { DOCX_FILENAME } from '../config/constants';

type UseNovedadesDownloadArgs = {
    filename?: string;
    inputOverride?: Omit<BuildDocInput, 'maxItemsPerSection'>; // por si querés pasar datos distintos a mockNovedades
};

export function useNovedadesDownload({
    filename = DOCX_FILENAME,
    inputOverride,
}: UseNovedadesDownloadArgs = {}) {
    const [loading, setLoading] = useState(false);

    const handleDownload = useCallback(async () => {
        try {
            setLoading(true);

            const input: BuildDocInput = inputOverride ?? {
                sectorGeneral: dataDefault.area,
                novedad: dataDefault.novedad,
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
