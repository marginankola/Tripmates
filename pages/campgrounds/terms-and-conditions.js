const TermsAndConditions = () => {
  return (
    <div className='py-3 lg:py-10'>
      <h2 className='mb-2 font-volkhov text-2xl lg:text-3xl'>
        Terms and Conditions
      </h2>
      <p className='mb-6'>
        By hosting a campground to <span className='text-brand'>Tripmates</span>{' '}
        you agree to following terms and conditions
      </p>
      <ul className='flex list-inside list-disc flex-col gap-3 rounded-lg bg-lightBlue p-5 lg:p-10 lg:text-lg lg:leading-8'>
        <li>
          By agreeing to host your campground on our booking page, you agree to
          abide by all applicable laws and regulations related to the operation
          of a campground.
        </li>
        <li>
          You are responsible for ensuring that your campground information,
          including pricing, availability, and amenities, is accurate and
          up-to-date on our booking page.
        </li>
        <li>
          You are responsible for promptly responding to all booking inquiries
          and customer service issues related to your campground.
        </li>
        <li>
          You agree to maintain a high level of cleanliness and safety at your
          campground, and to promptly address any customer complaints or issues
          related to cleanliness or safety.
        </li>
        <li>
          You agree to honor all bookings made through our booking page and to
          provide the customer with the agreed-upon services and amenities.
        </li>
        <li>
          You are responsible for collecting and remitting any applicable taxes
          or fees related to bookings made through our booking page.
        </li>
        <li>
          You agree to indemnify and hold us harmless from any claims, damages,
          or losses arising out of your use of our booking page or your
          operation of a campground.
        </li>
        <li>
          We reserve the right to terminate your hosting agreement at any time,
          for any reason, without notice.
        </li>
        <li>
          You acknowledge that any personal information or data collected
          through our booking page may be used in accordance with our privacy
          policy.
        </li>
        <li>
          If you subscribe to our premium service and opt to keep your
          campground exclusive to premium members, you will earn a higher
          commission on bookings made through our booking page by premium
          members.
        </li>
        <li>
          We reserve the right to update or modify these terms and conditions at
          any time, and any such changes will be effective immediately upon
          posting. It is your responsibility to regularly review these terms and
          conditions to ensure compliance.
        </li>
      </ul>
    </div>
  )
}

export default TermsAndConditions
