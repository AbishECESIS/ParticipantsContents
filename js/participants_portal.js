$(document).ready(function() {
    let accordionData = [];

    // Load JSON data from the file
    $.getJSON("/json/participants_portal_acc.json", function(data) {
        accordionData = data;
        renderAccordion(accordionData); // Display all accordions initially but disabled
    });

    // Function to filter and display data
    function updateAccordion() {
        const selectedValues = $('.on-dropdown')
            .map(function() { return $(this).val(); })
            .get()
            .filter(Boolean); // Get all selected values
    
        // Split selected values into two parts: first two and last two
        const split1 = selectedValues.slice(0, 2);
        const split2 = selectedValues.slice(2, 4);
    
        // Filter accordion data based on the split criteria
        const filteredData = selectedValues.length > 0
            ? accordionData.map(section => ({
                ...section,
                table: section.table.filter(row => {
                    let dropDownValues = [];
                    if (row['drop_down']) {
                        dropDownValues = row['drop_down'].split(',').map(v => v.trim());
                    }
    
                    // Check for split1: all values in split1 should exactly match values in dropDownValues
                    const split1Match = split1.every(value => dropDownValues.includes(value));
                    console.log('split1Match for row:', row, '=>', split1Match); // Log split1Match for exact matches
    
                    // Check for split2: at least one value in split2 should exactly match values in dropDownValues
                    const split2Match = split2.every(value => dropDownValues.includes(value));
                    console.log('split2Match for row:', row, '=>', split2Match); // Log split2Match for exact matches
    
                    // Only include the row if both split1 and split2 criteria are met
                    return split1Match && split2Match;
                })
            }))
            .filter(section => section.table.length > 0) // Only show sections with matching rows
            : accordionData; // If no dropdown value selected, show all data
    
        // Check if all dropdowns are selected (i.e., enable the accordion if true)
        const isEnabled = selectedValues.length === $('.on-dropdown').length;
        renderAccordion(filteredData, isEnabled); // Re-render accordion with filtered data and enabled state
    }
    
    
    

    // Event listener for dropdown changes
    $('.on-dropdown').change(updateAccordion);

    // Render accordion structure based on filtered data with sequential sub-numbering and disabled state
    function renderAccordion(data, isEnabled = false) {
        const $accordion = $('#guideaccordion');
        $accordion.empty();

        data.forEach((section, index) => {
            const accordionId = `collapse${index}`;
            const disabledClass = isEnabled ? "" : "disabled";
            const opacityStyle = isEnabled ? "" : "style='opacity: 0.5; cursor: not-allowed;'";
            let mainNumber = 1;

            let sectionHtml = `
                <div class="accordion-item ${disabledClass}" ${opacityStyle}>
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${accordionId}" aria-expanded="false" aria-controls="${accordionId}" ${isEnabled ? "" : "disabled"}>
                            <p><b>${section.main_heading}</b></p>
                            <p class="on-acc-sub-cnt">${section.requirement_note}</p>
                        </button>
                    </h2>
                    <div id="${accordionId}" class="accordion-collapse collapse" data-bs-parent="#guideaccordion">
                        <div class="accordion-body">
                            <div class="on-acc-tbl-div">
                                <table class="table on-acc-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Item</th>
                                            <th>Instructions</th>
                                            <th>SLA for verification</th>
                                        </tr>
                                    </thead>
                                    <tbody>
            `;

            let subCounter = 1;
            section.table.forEach(row => {
                let displayNumber = row.no;

                // Update display number for sub entries
                if (row.tr_value === "sub") {
                    displayNumber = `${mainNumber}.${subCounter++}`;
                } else {
                    mainNumber = parseInt(row.no, 10);
                    subCounter = 1;
                }

                const rowClass = row.tr_value === "sub" ? "on-acc-tbl-subcnt" : "on-acc-tbl-main-head";

                 // Dynamically add colspan for specific rows
                if (rowClass === "on-acc-tbl-main-head") {
                    sectionHtml += `
                        <tr class="${rowClass}">
                            <td>${displayNumber}</td>
                            <td colspan="2">${row.item}</td>
                            <td>${row.sla}</td>
                        </tr>
                    `;
                } else {
                    sectionHtml += `
                        <tr class="${rowClass}">
                            <td>${displayNumber}</td>
                            <td>${row.item}</td>
                            <td>${row.verticals}</td>
                            <td>${row.sla}</td>
                        </tr>
                    `;
                }
            });

            sectionHtml += `
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            $accordion.append(sectionHtml);
        });
    }

    // Scroll to Section 
    $('.navbar-nav .nav-item p').on('click', function(event) {
        event.preventDefault();

        // Get the class name of the clicked item, which matches the ID of the target div
        const targetClass = $(this).attr('class').split(' ')[0];
        const $targetDiv = $('#' + targetClass);

        if ($targetDiv.length) {
            const offset = 100; // Adjust this value as needed
            const targetPosition = $targetDiv.offset().top - offset;

            $('html, body').animate({
                scrollTop: targetPosition
            }, 60); // Adjust the animation speed if needed
        }
    });
});
