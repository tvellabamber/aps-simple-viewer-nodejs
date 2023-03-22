/// import * as Autodesk from "@types/forge-viewer";
import './extensions/Edit2dExtension/contents/main.js';
import './extensions/TransformExtension/contents/main.js';

async function getAccessToken(callback) {
    try {
        const resp = await fetch('/api/auth/token');
        if (!resp.ok) {
            throw new Error(await resp.text());
        }
        const { access_token, expires_in } = await resp.json();
        callback(access_token, expires_in);
    } catch (err) {
        alert('Could not obtain access token. See the console for more details.');
        console.error(err);
    }
}

export function initViewer(container) {
    return new Promise(function (resolve, reject) {
        Autodesk.Viewing.Initializer({ getAccessToken }, function () {
            const config = {
                extensions: ['Autodesk.DocumentBrowser']
            };
            window.viewer = new Autodesk.Viewing.GuiViewer3D(container, config);
            window.viewer.start();
            window.viewer.setTheme('dark-theme');
            resolve(window.viewer);
        });
    });
}

export function loadBaseModel(viewer, urn) {
    return new Promise(function (resolve, reject) {
        function onDocumentLoadSuccess(doc) {
            // doc.getRoot().getDefaultGeometry()
            let geom = doc.getRoot().search(
                { role: '2d', type: 'geometry' }
            )
            resolve(viewer.loadDocumentNode(doc, geom[0], { keepCurrentModels: false }, { preserveView: true }));
            
            
        }
        function onDocumentLoadFailure(code, message, errors) {
            reject({ code, message, errors });
        }
        viewer.setLightPreset(0);
        Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
    });

    
}

export function loadSecondaryModel(viewer, urn) {
    return new Promise(function (resolve, reject) {
        function onDocumentLoadSuccess(doc) {
            // doc.getRoot().getDefaultGeometry()
            let geom = doc.getRoot().search(
                { role: '2d', type: 'geometry' }
            )
            resolve(viewer.loadDocumentNode(doc, geom[0], { keepCurrentModels: true }, { preserveView: true }, {}));
            
        }
        function onDocumentLoadFailure(code, message, errors) {
            reject({ code, message, errors });
        }
        viewer.setLightPreset(0);
        Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
    });

    
}

