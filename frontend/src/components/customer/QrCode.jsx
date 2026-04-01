import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeCard = (value) => {

    return (
        <div className="p-6 bg-white rounded-4xl shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
            <QRCodeSVG
                id="qr-gen"
                value={value}
                size={200}
                level={"H"}
                fgColor="#0f172a"
            />
        </div>
    );
};

export default QRCodeCard;