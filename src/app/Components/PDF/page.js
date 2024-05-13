import { Document, Page, PDFViewer, StyleSheet, View, Text } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  body: {
    paddingTop: 20,
  },
  page: {
    padding: 20, // Add padding to the page
  },
  headingSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  heading: {
    fontSize: 18,
  },
  subHeading: {
    fontSize: 14,
  },
  table: {
    
  }
});

const PDF = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headingSection}>
          <Text style={styles.heading}>Payroll Details</Text>
          <Text style={styles.subHeading}>For the period of 12/01/2023 to 12/12/2023</Text>
        </View>
        <View style={{display: 'flex', flexDirection: 'row', gap: 4, textDecoration: 'underline'}}>
          <Text>Abc</Text>
          <Text>Abc</Text>
          <Text>Abc</Text>
          <Text>Abc</Text>
        </View>
      </Page>
    </Document>
  );
};

const PDFView = ({ testProp }) => {
  const [client, setClient] = useState(false);
  const [downloadInitiated, setDownloadInitiated] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  useEffect(() => {
    // Automatically start download when testProp becomes true
    if (testProp && !downloadInitiated) {
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(new Blob([<PDF key="pdf" />], { type: 'application/pdf' }));
      downloadLink.download = 'PDF_REPORT.pdf';
      downloadLink.click();
      setDownloadInitiated(true);
    }
  }, [testProp, downloadInitiated]);

  return (
    // Wrapping the condition in parentheses instead of curly braces
    !downloadInitiated && client && (
      <div style={{ width: "100vw", height: "100vh" }}>
        <PDFViewer width="100%" height="100%">
          <PDF />
        </PDFViewer>
      </div>
    )
  );
};

PDFView.propTypes = {
  testProp: PropTypes.bool.isRequired,
};

export default PDFView;
